export const SUMMARY_SYSTEM_PROMPT = `You are an expert document analyst specializing in creating clear, structured summaries. Your responses should be well-organized, concise, and formatted in clean markdown that works well in web interfaces. Focus on extracting the most important information and presenting it in a scannable format.`;

export const SUMMARY_USER_PROMPT_TEMPLATE = `Analyze the following document and create a comprehensive summary in markdown format. Structure your response with these sections:

## Document Overview
Provide a brief 2-3 sentence overview of what this document covers and its main purpose.

## Key Points
- Extract 4-6 most important points from the document
- Use bullet points for easy scanning
- Focus on actionable insights and main takeaways

## Technical Details
- Highlight any technical specifications, requirements, or architecture details
- Include relevant metrics, timelines, or resource requirements
- Use bullet points for clarity

## Claims & Insights
- Identify any specific claims, statistics, or research findings
- Note any conclusions or recommendations
- Highlight important insights that could impact decision-making

## Summary
Provide a 1-2 sentence conclusion of the document's main message.

**Important:** Format everything in clean markdown with proper headings (##), bullet points (-), and emphasis (**bold** for important terms). Keep the overall response concise but comprehensive.

Document content:
{text}`;
