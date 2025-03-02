import PocketBase from "pocketbase";
import AsyncStorage from "@react-native-async-storage/async-storage";

const pb = new PocketBase(`${process.env.EXPO_PUBLIC_API_URL}`);

// Load auth store from AsyncStorage
pb.authStore.onChange(async () => {
  await AsyncStorage.setItem("pb_auth", JSON.stringify(pb.authStore));
});

export const initPocketBase = async () => {
  const savedAuth = await AsyncStorage.getItem("pb_auth");
  if (savedAuth) {
    pb.authStore.save(JSON.parse(savedAuth));
  }
};

export const register = async (email: string, password: string) => {
  try {
    const data = {
      email,
      password,
      passwordConfirm: password,
    };

    const record = await pb.collection("users").create(data);
    return { success: true, data: record };
  } catch (error) {
    return { success: false, error };
  }
};

export const login = async (email: string, password: string) => {
  try {
    const authData = await pb
      .collection("users")
      .authWithPassword(email, password);
    return { success: true, data: authData };
  } catch (error) {
    return { success: false, error };
  }
};

// Add this function to your existing Pocketbase.ts
export const checkAuth = async () => {
  const savedAuth = await AsyncStorage.getItem('pb_auth');
  if (savedAuth) {
    const authData = JSON.parse(savedAuth);
    if (authData.isValid && authData.token) {
      pb.authStore.save(authData.token, authData.model);
      return true;
    }else{
      console.log('Auth data is not valid');
    }
  }
  return false;
};

export const requestVerification = async (email: string) => {
  try {
    console.log('Requesting verification for:', email);
    const response = await pb.collection('users').requestVerification(email);
    console.log('Verification response:', response);
    return { success: true };
  } catch (error) {
    console.error('Verification error:', error);
    return { success: false, error };
  }
};


export const confirmVerification = async (token: string) => {
  try {
    await pb.collection('users').confirmVerification(token);
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

export const checkEmailVerification = async () => {
  try {
    const user = pb.authStore.record;
    if (user) {
      return { verified: user.verified };
    }
    return { verified: false };
  } catch (error) {
    return { verified: false, error };
  }
};


export const logout = async () => {
  pb.authStore.clear();
  await AsyncStorage.removeItem("pb_auth");
};

export const isAuthenticated = () => {
  return pb.authStore.isValid;
};

export const getCurrentUser = () => {
  return pb.authStore.record;
};

export default pb;
