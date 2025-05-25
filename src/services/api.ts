
// API service for backend communication
const API_BASE_URL = 'http://localhost:8000'; // 请根据实际后端地址修改

export interface SymbolOption {
  id: number;
  symbol1: string;
  symbol2: string;
}

export interface GenerateSymbolsResponse {
  input: string;
  symbol_dict: SymbolOption[];
}

export interface GenerateImageResponse {
  status: string;
  image_url: string;
}

export interface SymbolSelection {
  symbol1: string;
  symbol2: string;
}

export const generateSymbols = async (name: string): Promise<GenerateSymbolsResponse> => {
  const response = await fetch(`${API_BASE_URL}/generate-symbols/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ input: name }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate symbols');
  }

  return response.json();
};

export const generateImage = async (symbols: SymbolSelection): Promise<GenerateImageResponse> => {
  const response = await fetch(`${API_BASE_URL}/generate-image/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(symbols),
  });

  if (!response.ok) {
    throw new Error('Failed to generate image');
  }

  return response.json();
};
