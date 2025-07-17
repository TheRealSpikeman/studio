// src/services/blogService.ts
'use client';

import { db, isFirebaseConfigured } from '@/lib/firebase';
import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  writeBatch,
} from 'firebase/firestore';
import type { BlogPost } from '@/types/blog';
import { initialBlogPosts } from '@/lib/data/blog-data';
import { toKebabCase } from '@/lib/string-utils';

const POSTS_COLLECTION = 'posts';

/**
 * Seeds the Firestore 'posts' collection with initial data if it's empty.
 * Ensures that slugs are always generated consistently from the title.
 */
const seedBlogPosts = async (): Promise<void> => {
    if (!isFirebaseConfigured || !db) return;
    const postsCollectionRef = collection(db, POSTS_COLLECTION);
    
    // Check if the collection is truly empty before seeding
    const snapshot = await getDocs(query(postsCollectionRef, limit(1)));
    if (!snapshot.empty) {
        console.log("Blog posts collection already contains data. Skipping seed.");
        return;
    }

    const batch = writeBatch(db);
    console.log("Seeding blog posts with consistent data...");
    initialBlogPosts.forEach(post => {
        const docRef = doc(db, POSTS_COLLECTION, post.id);
        const { id, ...postData } = post; // Firestore generates ID, we use the one from dummy data as the doc ID
        batch.set(docRef, postData);
    });

    await batch.commit();
    console.log("Blog posts collection has been seeded.");
};


const getAllPosts = async (): Promise<BlogPost[]> => {
  if (!isFirebaseConfigured || !db) return [];
  try {
    // Ensure data is seeded if collection is empty
    await seedBlogPosts();

    const postsCollectionRef = collection(db, POSTS_COLLECTION);
    const q = query(postsCollectionRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as BlogPost));
  } catch (error) {
    console.error("Error fetching all posts from Firestore:", error);
    return [];
  }
};

const getPostBySlug = async (slug: string): Promise<BlogPost | null> => {
    if (!isFirebaseConfigured || !db || !slug) return null;
    try {
        const postsCollectionRef = collection(db, POSTS_COLLECTION);
        const q = query(postsCollectionRef, where("slug", "==", slug), limit(1));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            console.log(`No post found with slug: ${slug}.`);
            return null;
        }
        
        const postDoc = querySnapshot.docs[0];
        return { id: postDoc.id, ...postDoc.data() } as BlogPost;
    } catch (error) {
        console.error(`Error fetching post by slug ${slug}:`, error);
        return null;
    }
}

const getPostById = async (id: string): Promise<BlogPost | null> => {
    if (!isFirebaseConfigured || !db) return null;
    try {
        const docRef = doc(db, POSTS_COLLECTION, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as BlogPost;
        } else {
            console.log(`No post found with id: ${id}.`);
            return null;
        }
    } catch (error) {
        console.error(`Error fetching post by id ${id}:`, error);
        return null;
    }
}

const updatePost = async (updatedPost: BlogPost): Promise<void> => {
    if (!isFirebaseConfigured || !db) throw new Error("Firebase not configured.");
    const { id, ...postData } = updatedPost;
    if (!id) {
        console.error("Update failed: Post ID is missing.");
        return;
    }
    const docRef = doc(db, POSTS_COLLECTION, id);
    
    // IMPORTANT: When updating, we do NOT regenerate the slug.
    // The slug is generated once at creation and should remain stable.
    const { slug, ...updatableData } = postData;
    
    // Ensure all data is plain to avoid Firestore issues with custom objects/undefined.
    const plainPostData = JSON.parse(JSON.stringify(updatableData));
    await updateDoc(docRef, plainPostData);
}

const createPost = async (newPost: Omit<BlogPost, 'id'>): Promise<string> => {
    if (!isFirebaseConfigured || !db) throw new Error("Firebase not configured.");
    
    // Generate a consistent slug from the title upon creation.
    const dataWithSlug = {
        ...newPost,
        slug: toKebabCase(newPost.title),
    };

    const postsCollectionRef = collection(db, POSTS_COLLECTION);
    const docRef = await addDoc(postsCollectionRef, dataWithSlug);
    return docRef.id;
}

const deletePost = async (postId: string): Promise<void> => {
    if (!isFirebaseConfigured || !db) throw new Error("Firebase not configured.");
    const docRef = doc(db, POSTS_COLLECTION, postId);
    await deleteDoc(docRef);
}

export const blogService = {
    getAllPosts,
    getPostBySlug,
    getPostById,
    updatePost,
    createPost,
    deletePost
};
