export const generateHook = async (data: {
  content: string;
  niche: string;
  platform: string;
  hookStyle?: string;
  targetAudience?: string;
  tone?: string;
}) => {
  const response = await fetch(import.meta.env.VITE_LAMBDA_GENERATE_HOOK, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) throw new Error('Hook generation failed');
  return await response.json();
};

export const generateAssembly = async (data: {
  content: string;
  platform?: string;
  contentFormat?: string;
  processingMode?: string;
}) => {
  const response = await fetch(import.meta.env.VITE_LAMBDA_GENERATE_ASSEMBLY, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) throw new Error('Assembly generation failed');
  return await response.json();
};

export const translateContent = async (data: {
  content: string;
  targetLanguage: string;
  culturalContext?: string;
  accessibilityLevel?: string;
}) => {
  const response = await fetch(import.meta.env.VITE_LAMBDA_TRANSLATE_CONTENT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) throw new Error('Translation failed');
  return await response.json();
};
