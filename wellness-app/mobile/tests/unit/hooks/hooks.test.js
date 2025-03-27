import { renderHook, act } from '@testing-library/react-hooks';
import { useFetch, useForm, useLocalStorage } from '../../../src/hooks';

// Mock fetch
global.fetch = jest.fn();

describe('useFetch hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch data successfully', async () => {
    const mockData = { id: 1, name: 'Test' };
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    });

    const { result, waitForNextUpdate } = renderHook(() => useFetch('https://api.example.com/data'));
    
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.data).toBeNull();
    
    await waitForNextUpdate();
    
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.data).toEqual(mockData);
    expect(global.fetch).toHaveBeenCalledWith('https://api.example.com/data', {});
  });

  it('should handle fetch error', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    const { result, waitForNextUpdate } = renderHook(() => useFetch('https://api.example.com/data'));
    
    expect(result.current.loading).toBe(true);
    
    await waitForNextUpdate();
    
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('Network error');
    expect(result.current.data).toBeNull();
  });

  it('should handle HTTP error', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 404
    });

    const { result, waitForNextUpdate } = renderHook(() => useFetch('https://api.example.com/data'));
    
    await waitForNextUpdate();
    
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('HTTP error! Status: 404');
    expect(result.current.data).toBeNull();
  });

  it('should refetch data when refetch is called', async () => {
    const mockData1 = { id: 1, name: 'Test 1' };
    const mockData2 = { id: 2, name: 'Test 2' };
    
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData1
    });

    const { result, waitForNextUpdate } = renderHook(() => useFetch('https://api.example.com/data'));
    
    await waitForNextUpdate();
    
    expect(result.current.data).toEqual(mockData1);
    
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData2
    });
    
    act(() => {
      result.current.refetch();
    });
    
    expect(result.current.loading).toBe(true);
    
    await waitForNextUpdate();
    
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toEqual(mockData2);
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });
});

describe('useForm hook', () => {
  const initialValues = {
    name: '',
    email: ''
  };
  
  const validate = (values) => {
    const errors = {};
    
    if (!values.name) {
      errors.name = 'Name is required';
    }
    
    if (!values.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = 'Email is invalid';
    }
    
    return errors;
  };

  it('should initialize with initial values', () => {
    const { result } = renderHook(() => useForm(initialValues, validate));
    
    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
    expect(result.current.touched).toEqual({});
  });

  it('should update values on handleChange', () => {
    const { result } = renderHook(() => useForm(initialValues, validate));
    
    act(() => {
      result.current.handleChange('name', 'John Doe');
    });
    
    expect(result.current.values.name).toBe('John Doe');
  });

  it('should update touched and validate on handleBlur', () => {
    const { result } = renderHook(() => useForm(initialValues, validate));
    
    act(() => {
      result.current.handleBlur('name');
    });
    
    expect(result.current.touched.name).toBe(true);
    expect(result.current.errors.name).toBe('Name is required');
  });

  it('should validate all fields on handleSubmit', () => {
    const onSubmit = jest.fn();
    const { result } = renderHook(() => useForm(initialValues, validate));
    
    act(() => {
      result.current.handleSubmit(onSubmit)();
    });
    
    expect(result.current.touched).toEqual({ name: true, email: true });
    expect(result.current.errors).toEqual({
      name: 'Name is required',
      email: 'Email is required'
    });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('should call onSubmit when there are no errors', () => {
    const onSubmit = jest.fn();
    const { result } = renderHook(() => useForm(initialValues, validate));
    
    act(() => {
      result.current.handleChange('name', 'John Doe');
      result.current.handleChange('email', 'john@example.com');
      result.current.handleSubmit(onSubmit)();
    });
    
    expect(result.current.errors).toEqual({});
    expect(onSubmit).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com'
    });
  });

  it('should reset form state', () => {
    const { result } = renderHook(() => useForm(initialValues, validate));
    
    act(() => {
      result.current.handleChange('name', 'John Doe');
      result.current.handleBlur('name');
      result.current.resetForm();
    });
    
    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
    expect(result.current.touched).toEqual({});
  });
});

describe('useLocalStorage hook', () => {
  // Mock localStorage
  const localStorageMock = (() => {
    let store = {};
    return {
      getItem: jest.fn(key => store[key] || null),
      setItem: jest.fn((key, value) => {
        store[key] = value.toString();
      }),
      clear: jest.fn(() => {
        store = {};
      })
    };
  })();
  
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
  });

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
  });

  it('should initialize with initial value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 'initialValue'));
    
    expect(result.current[0]).toBe('initialValue');
    expect(localStorageMock.getItem).toHaveBeenCalledWith('testKey');
  });

  it('should initialize with localStorage value when available', () => {
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify('storedValue'));
    
    const { result } = renderHook(() => useLocalStorage('testKey', 'initialValue'));
    
    expect(result.current[0]).toBe('storedValue');
  });

  it('should update localStorage when value changes', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 'initialValue'));
    
    act(() => {
      result.current[1]('newValue');
    });
    
    expect(result.current[0]).toBe('newValue');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('testKey', JSON.stringify('newValue'));
  });

  it('should handle function updates', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 'initialValue'));
    
    act(() => {
      result.current[1](prev => prev + ' updated');
    });
    
    expect(result.current[0]).toBe('initialValue updated');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('testKey', JSON.stringify('initialValue updated'));
  });
});
