
// API service for backend communication
const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:8000';

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

// 检查API连接
export const checkApiConnection = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/docs`, {
      method: 'GET',
    });
    return response.ok;
  } catch (error) {
    console.error('API connection check failed:', error);
    return false;
  }
};

export const generateSymbols = async (name: string): Promise<GenerateSymbolsResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/generate-symbols/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name_input: name }), // 使用 name_input 字段
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('API端点未找到，请检查后端服务是否正确配置');
      } else if (response.status >= 500) {
        throw new Error('服务器内部错误，请稍后重试');
      } else {
        throw new Error(`请求失败: ${response.status} ${response.statusText}`);
      }
    }

    // 后端返回的是 JSON 字符串，需要先解析
    const jsonString = await response.json();
    const result = JSON.parse(jsonString);
    
    return result;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('无法连接到服务器，请检查：\n1. 后端服务是否已启动\n2. API地址是否正确\n3. 网络连接是否正常');
    }
    throw error;
  }
};

export const generateImage = async (symbols: SymbolSelection): Promise<GenerateImageResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/generate-image/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(symbols),
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('图片生成API端点未找到');
      } else if (response.status >= 500) {
        throw new Error('图片生成服务器错误，请稍后重试');
      } else {
        throw new Error(`图片生成失败: ${response.status} ${response.statusText}`);
      }
    }

    // 直接返回后端的响应格式
    return response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('无法连接到图片生成服务，请检查网络连接');
    }
    throw error;
  }
};
