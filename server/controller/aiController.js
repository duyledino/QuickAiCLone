import pool from "../config/db.js";
import ai from "../config/llm.js";
import together from "../config/imgllm.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import pdf from "pdf-parse";
// router.post("/article_writter",auth,generateArticle);
// router.post("/image_generator",auth,generateImage);
// router.post("/background_removal",auth,removeBg);
// router.post("/resume_reviewer",auth,reviewResume);
const generateArticle = async (req, res) => {
  const { articleTopic, length } = req.body;
  const { user } = req;
  console.log(user);
  const prompt = `You are a professional writer and markdown expert. Write a high-quality, engaging, and informative article about the topic: "${articleTopic}".

The article should:
- Be written in clear, fluent, and natural English.
- Use markdown formatting (e.g., \`#\` for headings, \`**bold**\`, \`*italic*\`, \`-\` lists, etc.)
- Have a logical structure with:
  - A title (\`#\`)
  - An introduction
  - At least 2–4 main sections with subheadings (\`##\`)
  - A short conclusion
- Include examples, explanations, or comparisons when appropriate.
- Avoid generic fluff—focus on useful, specific content.
- The total length should be approximately **${length} words**.

Do not include any explanations about the markdown itself. Just return the raw markdown-formatted article.`;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        temperature: 0.7,
      },
    });

    await pool.query(
      `insert into creations(user_id,prompt,content,type) values($1,$2,$3,$4)`,
      [user.user_id, articleTopic, response.text, "Article"]
    );
    return res.status(200).json({ article: response.text });
  } catch (error) {
    console.error(error.stack);
    return res.status(400).json({ Message: error });
  }
};

const generateImage = async (req, res) => {
  const { style, prompt,publish } = req.body;
  const { user } = req;
  console.log("user from middleware", user);
  console.log(`${prompt} in ${style}`);
  //sexy woman wearing bikini and face her booty
  // const userData = pool.query("select * from users where user where ",[])
  try {
    const response = await together.images.create({
      // model: "black-forest-labs/FLUX.1-schnell", // accept nsfw content
      model: "black-forest-labs/FLUX.1-schnell-Free",
      steps: 4,
      prompt: `${prompt} in ${style}`,
      disable_safety_checker: true, // except in black-forest-labs/FLUX.1-schnell-Free
    });

    await pool.query(
      `insert into creations(user_id,prompt,content,type,publish) values($1,$2,$3,$4,$5)`,
      [
        user.user_id,
        `${prompt} in ${style}`,
        response.data[0].url,
        "Image Generation",
        publish
      ]
    );

    return res.status(200).json({ imagesURL: response.data[0].url });
  } catch (error) {
    return res.status(200).json({ imagesURL: error });
  }
};

const removeBg = async (req, res) => {
  // const {image} = req.file;
  const image = req.file;
  const { user } = req;
  // const userData = pool.query("select * from users where user where ",[])
  const { secure_url } = await cloudinary.uploader.upload(image.path, {
    transformation: [
      {
        effect: "background_removal",
        background_removal: "remove_the_background",
      },
    ],
  });

  await pool.query(
    `insert into creations(user_id,prompt,content,type) values($1,$2,$3,$4)`,
    [
      user.user_id,
      "Remove background: " + image.path,
      secure_url,
      "Background Removal",
    ]
  );

  return res.status(200).json({ uploadResult: secure_url });
};

const reviewResume = async (req, res) => {
  const { user } = req;
  const myPdf = req.file;
  const pdfPath = myPdf.path;
  const dataBuffer = fs.readFileSync(pdfPath);
  try {
    const data = await pdf(dataBuffer);
    fs.unlinkSync(pdfPath);
    console.log(data);
    const prompt = `You are an expert career advisor and resume reviewer. Your task is to evaluate a resume and return a numeric score between -50 and 100, where:

- 90–100: Excellent resume, ready for top jobs.
- 70–89: Strong resume, minor improvements recommended.
- 50–69: Average resume, several issues to fix.
- 0–49: Weak resume, major revisions needed.
- Below 0: Very poor resume that may be misleading, irrelevant, or empty.

Analyze the resume for:
- Relevance to a specific job or industry (if provided),
- Clarity, grammar, and formatting,
- Quality of experience descriptions and achievements (impact, results, metrics),
- Use of keywords and professional tone,
- Presence of unnecessary or harmful elements (e.g., age, personal info, outdated skills).

Return your result in **Markdown format** as follows:

---

### 🧾 Resume Score: \`82/100\`

---

### ✅ Strengths

- Clear formatting and layout
- Strong action verbs in experience
- Measurable achievements included

---

### ❌ Weaknesses

- No professional summary
- Missing dates in Education section
- Lacks technical skills section

---

### 🛠 Suggestions for Improvement

- Add a concise professional summary at the top
- Include dates for each degree or certification
- List relevant technical skills in a dedicated section

---

If the resume is extremely poor or irrelevant, assign a **negative score** and clearly explain why.
Here is resume: ${data.text}
`;
    const responseLLM = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        temperature: 0.5,
      },
    });

    await pool.query(
      `insert into creations(user_id,prompt,content,type) values($1,$2,$3,$4)`,
      [
        user.user_id,
        "Review resume: " + data.text.slice(0,30),
        responseLLM.text,
        "Resume Reviewer",
      ]
    );
    return res.status(200).json({ pdfData: responseLLM.text });
  } catch (error) {
    console.error(error);
  }
};

export { generateArticle, generateImage, removeBg, reviewResume };
