import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  query,
  orderBy,
  serverTimestamp,
  onSnapshot,
  increment,
} from "firebase/firestore";
import { db } from "../firebase";

// ── Opinions ─────────────────────────────────────────────────────────────────
export function useOpinions() {
  const [opinions, setOpinions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const q = query(
      collection(db, "opinions"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const data = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        setOpinions(data);
        setLoading(false);
      },
      (err) => {
        console.error("Opinions Firestore error:", err);

        setError(err);
        setOpinions([]);
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  async function publishOpinion(data) {
    try {
      return await addDoc(collection(db, "opinions"), {
        ...data,
        likes: [],
        commentsCount: 0,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("Publish opinion error:", err);
      throw err;
    }
  }

  async function toggleLike(opinionId, uid) {
    const ref = doc(db, "opinions", opinionId);
    const opinion = opinions.find((o) => o.id === opinionId);

    const liked = opinion?.likes?.includes(uid);

    await updateDoc(ref, {
      likes: liked ? arrayRemove(uid) : arrayUnion(uid),
    });
  }

  return {
    opinions,
    loading,
    error,
    publishOpinion,
    toggleLike,
  };
}

// ── Comments ──────────────────────────────────────────────────────────────────
export function useComments(opinionId) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (!opinionId) return;
    const q = query(
      collection(db, "opinions", opinionId, "comments"),
      orderBy("createdAt", "asc")
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        setComments(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => {
        console.error("Comments Firestore error:", err);
        setError(err);
        setComments([]);
        setLoading(false);
      }
    );
    return unsub;
  }, [opinionId]);

  async function addComment(targetOpinionId, comment) {
    const id = targetOpinionId || opinionId;
    const opRef = doc(db, "opinions", id);
    await addDoc(collection(db, "opinions", id, "comments"), {
      ...comment,
      likes: [],
      replies: [],
      createdAt: serverTimestamp(),
    });
    await updateDoc(opRef, { commentsCount: increment(1) });
  }

  async function toggleCommentLike(targetOpinionId, commentId, uid) {
    const id = targetOpinionId || opinionId;
    const ref = doc(db, "opinions", id, "comments", commentId);
    const comment = comments.find((c) => c.id === commentId);
    const liked = comment?.likes?.includes(uid);
    await updateDoc(ref, { likes: liked ? arrayRemove(uid) : arrayUnion(uid) });
  }

  async function addReply(targetOpinionId, commentId, reply) {
    const id = targetOpinionId || opinionId;
    const ref = doc(db, "opinions", id, "comments", commentId);
    await updateDoc(ref, {
      replies: arrayUnion({
        ...reply,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      }),
    });
  }

  return { comments, loading, error, addComment, toggleCommentLike, addReply };
}
