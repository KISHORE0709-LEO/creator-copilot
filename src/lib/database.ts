import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { db, COLLECTIONS } from "./firebase";

export const createContent = async (userId: string, data: any) => {
  return await addDoc(collection(db, COLLECTIONS.CONTENT), {
    ...data,
    userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
};

export const getUserContent = async (userId: string) => {
  const q = query(
    collection(db, COLLECTIONS.CONTENT),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateContent = async (contentId: string, data: any) => {
  const docRef = doc(db, COLLECTIONS.CONTENT, contentId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: new Date().toISOString()
  });
};

export const deleteContent = async (contentId: string) => {
  await deleteDoc(doc(db, COLLECTIONS.CONTENT, contentId));
};

export const saveAnalytics = async (userId: string, contentId: string, scores: any) => {
  return await addDoc(collection(db, COLLECTIONS.ANALYTICS), {
    userId,
    contentId,
    scores,
    analyzedAt: new Date().toISOString()
  });
};

export const saveTrend = async (userId: string, trendData: any) => {
  return await addDoc(collection(db, COLLECTIONS.TRENDS), {
    userId,
    ...trendData,
    savedAt: new Date().toISOString()
  });
};

export const saveCalendarPlan = async (userId: string, plan: any) => {
  return await addDoc(collection(db, COLLECTIONS.CALENDAR), {
    userId,
    plan,
    createdAt: new Date().toISOString()
  });
};

export const saveCopyrightCheck = async (userId: string, contentId: string, result: any) => {
  return await addDoc(collection(db, COLLECTIONS.COPYRIGHT), {
    userId,
    contentId,
    result,
    checkedAt: new Date().toISOString()
  });
};

export const saveMonetizationData = async (userId: string, data: any) => {
  return await addDoc(collection(db, COLLECTIONS.MONETIZATION), {
    userId,
    ...data,
    savedAt: new Date().toISOString()
  });
};

export const saveChatMessage = async (userId: string, message: string, response: string) => {
  return await addDoc(collection(db, COLLECTIONS.CHAT_HISTORY), {
    userId,
    message,
    response,
    timestamp: new Date().toISOString()
  });
};
