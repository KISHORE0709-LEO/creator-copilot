import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage, COLLECTIONS } from "./firebase";
import { getDefaultAvatarForGender } from "./avatars";

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string;
  photoURL?: string;
  gender?: 'male' | 'female' | null;
  createdAt: string;
  updatedAt: string;
  subscription: string;
  contentCount: number;
  socialLinks: {
    instagram: string;
    youtube: string;
    twitter: string;
    linkedin: string;
    tiktok: string;
    facebook: string;
  };
  platformStatus: {
    [key: string]: {
      active: boolean;
      followers: number;
    };
  };
  preferences: {
    theme: string;
    notifications: boolean;
  };
}

export const signUp = async (email: string, password: string, displayName: string, gender?: 'male' | 'female') => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  const defaultAvatar = getDefaultAvatarForGender(gender || null);
  
  const userProfile: UserProfile = {
    uid: user.uid,
    email: user.email,
    displayName,
    photoURL: defaultAvatar.url,
    gender: gender || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    subscription: 'free',
    contentCount: 0,
    socialLinks: {
      instagram: '',
      youtube: '',
      twitter: '',
      linkedin: '',
      tiktok: '',
      facebook: ''
    },
    platformStatus: {
      instagram: { active: false, followers: 0 },
      youtube: { active: false, followers: 0 },
      twitter: { active: false, followers: 0 },
      linkedin: { active: false, followers: 0 },
      tiktok: { active: false, followers: 0 },
      facebook: { active: false, followers: 0 }
    },
    preferences: {
      theme: 'dark',
      notifications: true
    }
  };
  
  await setDoc(doc(db, COLLECTIONS.USERS, user.uid), userProfile);
  
  return user;
};

export const signIn = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const logOut = async () => {
  await signOut(auth);
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const docRef = doc(db, COLLECTIONS.USERS, uid);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() as UserProfile : null;
};

export const updateUserProfile = async (uid: string, updates: Partial<UserProfile>) => {
  const docRef = doc(db, COLLECTIONS.USERS, uid);
  const updateData = {
    ...updates,
    updatedAt: new Date().toISOString()
  };
  await updateDoc(docRef, updateData);
};

export const uploadAvatar = async (uid: string, file: File): Promise<string> => {
  const storageRef = ref(storage, `avatars/${uid}/${Date.now()}_${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  
  // Update user profile with new avatar URL
  await updateUserProfile(uid, { photoURL: downloadURL });
  
  return downloadURL;
};

export const updateSocialLinks = async (uid: string, socialLinks: UserProfile['socialLinks']) => {
  await updateUserProfile(uid, { socialLinks });
};

export const updatePlatformStatus = async (uid: string, platformStatus: UserProfile['platformStatus']) => {
  await updateUserProfile(uid, { platformStatus });
};

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  const user = userCredential.user;
  
  const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, user.uid));
  if (!userDoc.exists()) {
    const defaultAvatar = getDefaultAvatarForGender(null); // Default to male for Google sign-in
    
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || 'User',
      photoURL: user.photoURL || defaultAvatar.url,
      gender: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      subscription: 'free',
      contentCount: 0,
      socialLinks: {
        instagram: '',
        youtube: '',
        twitter: '',
        linkedin: '',
        tiktok: '',
        facebook: ''
      },
      platformStatus: {
        instagram: { active: false, followers: 0 },
        youtube: { active: false, followers: 0 },
        twitter: { active: false, followers: 0 },
        linkedin: { active: false, followers: 0 },
        tiktok: { active: false, followers: 0 },
        facebook: { active: false, followers: 0 }
      },
      preferences: {
        theme: 'dark',
        notifications: true
      }
    };
    
    await setDoc(doc(db, COLLECTIONS.USERS, user.uid), userProfile);
  }
  
  return user;
};
