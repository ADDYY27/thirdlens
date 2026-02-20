import { useState, useEffect } from "react";
import {
  collection, addDoc, getDocs, doc, updateDoc,
  arrayUnion, arrayRemove, query, orderBy,
  serverTimestamp, onSnapshot, where, increment,
} from "firebase/firestore";
import { db } from "../firebase";

// ── Opinions ─────────────────────────────────────────────────────────────────
export function useOpinions() {
  const [opinions, setOpinions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "opinions"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setOpinions(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, []);

  async function publishOpinion(data) {
    return addDoc(collection(db, "opinions"), {
      ...data,
      likes: [],
      commentsCount: 0,
      createdAt: serverTimestamp(),
    });
  }

  async function toggleLike(opinionId, uid) {
    const ref = doc(db, "opinions", opinionId);
    const opinion = opinions.find(o => o.id === opinionId);
    const liked = opinion?.likes?.includes(uid);
    await updateDoc(ref, { likes: liked ? arrayRemove(uid) : arrayUnion(uid) });
  }

  return { opinions, loading, publishOpinion, toggleLike };
}

// ── Comments ──────────────────────────────────────────────────────────────────
export function useComments(opinionId) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!opinionId) return;
    const q = query(
      collection(db, "opinions", opinionId, "comments"),
      orderBy("createdAt", "asc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setComments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, [opinionId]);

  async function addComment(opinionId, comment) {
    const opRef = doc(db, "opinions", opinionId);
    await addDoc(collection(db, "opinions", opinionId, "comments"), {
      ...comment,
      likes: [],
      replies: [],
      createdAt: serverTimestamp(),
    });
    await updateDoc(opRef, { commentsCount: increment(1) });
  }

  async function toggleCommentLike(opinionId, commentId, uid) {
    const ref = doc(db, "opinions", opinionId, "comments", commentId);
    const comment = comments.find(c => c.id === commentId);
    const liked = comment?.likes?.includes(uid);
    await updateDoc(ref, { likes: liked ? arrayRemove(uid) : arrayUnion(uid) });
  }

  async function addReply(opinionId, commentId, reply) {
    const ref = doc(db, "opinions", opinionId, "comments", commentId);
    await updateDoc(ref, {
      replies: arrayUnion({ ...reply, id: Date.now().toString(), createdAt: new Date().toISOString() })
    });
  }

  return { comments, loading, addComment, toggleCommentLike, addReply };
}
