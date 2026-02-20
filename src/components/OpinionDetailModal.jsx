import { useState } from "react";
import { useComments } from "../hooks/useOpinions";

export default function OpinionDetailModal({ opinion, onClose, onLike, user, onShowAuth }) {
  const { comments, loading: cLoading, addComment, toggleCommentLike, addReply } = useComments(opinion.id);
  const [commentText, setCommentText] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [posting, setPosting] = useState(false);
  const liked = user && opinion.likes?.includes(user.uid);
  const fmtDate = (ts) => { try { return ts?.toDate ? ts.toDate().toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"}) : new Date(ts).toLocaleDateString() } catch{ return "Recent"; }};

  const S = {
    overlay: { position:"fixed",inset:0,zIndex:400,background:"rgba(0,0,0,0.92)",backdropFilter:"blur(12px)",display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"40px 24px",overflowY:"auto",animation:"fadeUp 0.3s ease" },
    box: { background:"linear-gradient(160deg,#161410,#111)",border:"1px solid rgba(200,151,58,0.2)",borderRadius:"6px",width:"100%",maxWidth:"760px",overflow:"hidden",boxShadow:"0 32px 80px rgba(0,0,0,0.8)" },
    input: { width:"100%",padding:"12px 16px",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(200,151,58,0.15)",borderRadius:"3px",color:"#faf6ef",fontFamily:"'Libre Baskerville',Georgia,serif",fontSize:"0.95rem",outline:"none",resize:"vertical",transition:"all 0.2s",boxSizing:"border-box" },
  };

  async function postComment() {
    if (!user) { onShowAuth(); return; }
    if (!commentText.trim()) return;
    setPosting(true);
    await addComment(opinion.id, { text: commentText.trim(), authorName: user.displayName||"Anonymous", authorUid: user.uid });
    setCommentText("");
    setPosting(false);
  }

  async function postReply(commentId) {
    if (!user) { onShowAuth(); return; }
    if (!replyText.trim()) return;
    setPosting(true);
    await addReply(opinion.id, commentId, { text: replyText.trim(), authorName: user.displayName||"Anonymous", authorUid: user.uid });
    setReplyText(""); setReplyTo(null);
    setPosting(false);
  }

  return (
    <div style={S.overlay} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={S.box}>
        {/* Header */}
        <div style={{ padding:"24px 28px",borderBottom:"1px solid rgba(200,151,58,0.12)",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
          <p style={{ fontFamily:"'Courier New',monospace",fontSize:"9px",color:"#c8973a",letterSpacing:"0.25em",textTransform:"uppercase" }}>◆ Opinion · {opinion.category}</p>
          <button onClick={onClose} style={{ width:"32px",height:"32px",background:"transparent",border:"1px solid rgba(200,151,58,0.2)",borderRadius:"50%",color:"#6b6560",cursor:"pointer",fontSize:"14px",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s" }}
            onMouseEnter={e=>{ e.currentTarget.style.borderColor="rgba(216,79,59,0.5)"; e.currentTarget.style.color="#d84f3b"; }}
            onMouseLeave={e=>{ e.currentTarget.style.borderColor="rgba(200,151,58,0.2)"; e.currentTarget.style.color="#6b6560"; }}
          >✕</button>
        </div>

        {/* Article body */}
        <div style={{ padding:"36px 40px", borderBottom:"1px solid rgba(200,151,58,0.1)" }}>
          <h1 style={{ fontFamily:"'Libre Baskerville',Georgia,serif",fontSize:"1.8rem",fontWeight:700,color:"#faf6ef",lineHeight:1.35,marginBottom:"12px" }}>{opinion.title}</h1>
          {opinion.tagline && <p style={{ fontFamily:"'Libre Baskerville',Georgia,serif",fontStyle:"italic",fontSize:"1.05rem",color:"#9a9090",marginBottom:"20px",lineHeight:1.65 }}>{opinion.tagline}</p>}

          {/* Author row */}
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"28px",paddingBottom:"20px",borderBottom:"1px solid rgba(200,151,58,0.1)" }}>
            <div style={{ display:"flex",alignItems:"center",gap:"12px" }}>
              <div style={{ width:"40px",height:"40px",borderRadius:"50%",background:"rgba(200,151,58,0.12)",border:"1px solid rgba(200,151,58,0.3)",display:"flex",alignItems:"center",justifyContent:"center",color:"#c8973a",fontWeight:700,fontSize:"16px" }}>
                {opinion.authorName?.[0]?.toUpperCase()||"?"}
              </div>
              <div>
                <p style={{ fontFamily:"'Libre Baskerville',Georgia,serif",fontWeight:700,color:"#faf6ef" }}>{opinion.authorName}</p>
                <p style={{ fontFamily:"'Courier New',monospace",fontSize:"9px",color:"#6b6560",letterSpacing:"0.08em" }}>{fmtDate(opinion.createdAt)}</p>
              </div>
            </div>
            <button onClick={onLike} style={{ display:"flex",alignItems:"center",gap:"8px",padding:"8px 16px",background: liked?"rgba(200,151,58,0.1)":"transparent",border: liked?"1px solid rgba(200,151,58,0.4)":"1px solid rgba(200,151,58,0.2)",borderRadius:"3px",color: liked?"#c8973a":"#6b6560",fontFamily:"'Courier New',monospace",fontSize:"11px",fontWeight:700,letterSpacing:"0.1em",cursor:"pointer",transition:"all 0.2s" }}
              onMouseEnter={e=>{ e.currentTarget.style.color="#c8973a"; e.currentTarget.style.borderColor="rgba(200,151,58,0.4)"; }}
              onMouseLeave={e=>{ e.currentTarget.style.color=liked?"#c8973a":"#6b6560"; }}
            >{liked?"♥":"♡"} {opinion.likes?.length||0} {opinion.likes?.length===1?"Like":"Likes"}</button>
          </div>

          {/* Tagged article */}
          {opinion.taggedArticle && (
            <div style={{ background:"rgba(200,151,58,0.05)",border:"1px solid rgba(200,151,58,0.15)",borderLeft:"3px solid rgba(200,151,58,0.6)",borderRadius:"3px",padding:"12px 16px",marginBottom:"24px" }}>
              <p style={{ fontFamily:"'Courier New',monospace",fontSize:"8px",color:"#c8973a",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:"4px" }}>📎 In Response To</p>
              <p style={{ fontFamily:"'Libre Baskerville',Georgia,serif",fontSize:"0.9rem",color:"#9a9090" }}>{opinion.taggedArticle.title}</p>
            </div>
          )}

          {/* Body */}
          <div style={{ fontFamily:"'Libre Baskerville',Georgia,serif",fontSize:"1.05rem",color:"#c8c0b0",lineHeight:1.85, whiteSpace:"pre-wrap" }}>
            {opinion.body}
          </div>
        </div>

        {/* Comments */}
        <div style={{ padding:"28px 40px" }}>
          <h3 style={{ fontFamily:"'UnifrakturMaguntia',cursive",fontSize:"1.4rem",color:"#faf6ef",marginBottom:"20px" }}>
            💬 Discussion ({opinion.commentsCount||0})
          </h3>

          {/* Comment input */}
          <div style={{ marginBottom:"28px" }}>
            <textarea
              style={{ ...S.input, minHeight:"80px" }}
              placeholder={user ? "Share your thoughts on this opinion…" : "Sign in to join the discussion →"}
              value={commentText}
              onChange={e=>setCommentText(e.target.value)}
              onFocus={e=>{ e.target.style.border="1px solid rgba(200,151,58,0.5)"; }}
              onBlur={e=>{ e.target.style.border="1px solid rgba(200,151,58,0.15)"; }}
              onClick={()=>{ if(!user) onShowAuth(); }}
              readOnly={!user}
            />
            <div style={{ display:"flex",justifyContent:"flex-end",marginTop:"10px" }}>
              <button onClick={postComment} disabled={posting||!commentText.trim()}
                style={{ padding:"9px 22px",background: posting||!commentText.trim()?"rgba(200,151,58,0.1)":"linear-gradient(135deg,#c8973a,#e8b85a)",border:"none",borderRadius:"3px",color: posting||!commentText.trim()?"#6b6560":"#0a0a0a",fontFamily:"'Courier New',monospace",fontSize:"10px",fontWeight:900,letterSpacing:"0.15em",textTransform:"uppercase",cursor: posting||!commentText.trim()?"not-allowed":"pointer",transition:"all 0.2s" }}>
                {posting?"Posting…":"Post Comment →"}
              </button>
            </div>
          </div>

          {/* Comments list */}
          {cLoading ? (
            <p style={{ fontFamily:"'Courier New',monospace",fontSize:"11px",color:"#6b6560",textAlign:"center",padding:"20px" }}>Loading comments…</p>
          ) : comments.length === 0 ? (
            <p style={{ fontFamily:"'Libre Baskerville',Georgia,serif",fontStyle:"italic",color:"#6b6560",textAlign:"center",padding:"20px" }}>No comments yet. Start the conversation.</p>
          ) : (
            <div style={{ display:"flex",flexDirection:"column",gap:"16px" }}>
              {comments.map(comment => {
                const cLiked = user && comment.likes?.includes(user.uid);
                return (
                  <div key={comment.id} style={{ background:"rgba(255,255,255,0.02)",border:"1px solid rgba(200,151,58,0.08)",borderRadius:"4px",padding:"16px 18px" }}>
                    <div style={{ display:"flex",justifyContent:"space-between",marginBottom:"10px" }}>
                      <div style={{ display:"flex",alignItems:"center",gap:"8px" }}>
                        <div style={{ width:"26px",height:"26px",borderRadius:"50%",background:"rgba(200,151,58,0.1)",border:"1px solid rgba(200,151,58,0.2)",display:"flex",alignItems:"center",justifyContent:"center",color:"#c8973a",fontSize:"10px",fontWeight:700 }}>
                          {comment.authorName?.[0]?.toUpperCase()||"?"}
                        </div>
                        <span style={{ fontFamily:"'Libre Baskerville',Georgia,serif",fontSize:"0.85rem",color:"#faf6ef",fontWeight:600 }}>{comment.authorName}</span>
                        <span style={{ fontFamily:"'Courier New',monospace",fontSize:"9px",color:"#6b6560" }}>
                          {comment.createdAt?.toDate ? comment.createdAt.toDate().toLocaleDateString() : ""}
                        </span>
                      </div>
                      <div style={{ display:"flex",gap:"12px",alignItems:"center" }}>
                        <button onClick={()=>user ? toggleCommentLike(opinion.id,comment.id,user.uid) : onShowAuth()}
                          style={{ background:"none",border:"none",cursor:"pointer",color:cLiked?"#c8973a":"#6b6560",fontFamily:"'Courier New',monospace",fontSize:"10px",display:"flex",alignItems:"center",gap:"4px",transition:"color 0.2s" }}>
                          {cLiked?"♥":"♡"} {comment.likes?.length||0}
                        </button>
                        <button onClick={()=>setReplyTo(replyTo===comment.id?null:comment.id)}
                          style={{ background:"none",border:"none",cursor:"pointer",color:"#6b6560",fontFamily:"'Courier New',monospace",fontSize:"9px",letterSpacing:"0.1em",textTransform:"uppercase",transition:"color 0.2s" }}
                          onMouseEnter={e=>e.currentTarget.style.color="#c8973a"}
                          onMouseLeave={e=>e.currentTarget.style.color="#6b6560"}
                        >↩ Reply</button>
                      </div>
                    </div>
                    <p style={{ fontFamily:"'Libre Baskerville',Georgia,serif",fontSize:"0.95rem",color:"#c8c0b0",lineHeight:1.7 }}>{comment.text}</p>

                    {/* Replies */}
                    {comment.replies?.length > 0 && (
                      <div style={{ marginTop:"12px",paddingLeft:"16px",borderLeft:"2px solid rgba(200,151,58,0.15)",display:"flex",flexDirection:"column",gap:"10px" }}>
                        {comment.replies.map(reply=>(
                          <div key={reply.id} style={{ background:"rgba(255,255,255,0.02)",borderRadius:"3px",padding:"10px 12px" }}>
                            <p style={{ fontFamily:"'Libre Baskerville',Georgia,serif",fontSize:"0.85rem",color:"#9a9090",fontWeight:600,marginBottom:"4px" }}>↩ {reply.authorName}</p>
                            <p style={{ fontFamily:"'Libre Baskerville',Georgia,serif",fontSize:"0.9rem",color:"#b8b0a0",lineHeight:1.6 }}>{reply.text}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reply input */}
                    {replyTo === comment.id && (
                      <div style={{ marginTop:"12px",paddingLeft:"16px",borderLeft:"2px solid rgba(200,151,58,0.2)" }}>
                        <textarea
                          style={{ ...S.input,minHeight:"60px",fontSize:"0.88rem" }}
                          placeholder={`Replying to ${comment.authorName}…`}
                          value={replyText} onChange={e=>setReplyText(e.target.value)}
                          onFocus={e=>e.target.style.border="1px solid rgba(200,151,58,0.5)"}
                          onBlur={e=>e.target.style.border="1px solid rgba(200,151,58,0.15)"}
                        />
                        <div style={{ display:"flex",gap:"8px",marginTop:"8px",justifyContent:"flex-end" }}>
                          <button onClick={()=>{ setReplyTo(null); setReplyText(""); }}
                            style={{ padding:"7px 14px",background:"transparent",border:"1px solid rgba(200,151,58,0.2)",borderRadius:"3px",color:"#6b6560",fontFamily:"'Courier New',monospace",fontSize:"9px",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",cursor:"pointer" }}>
                            Cancel
                          </button>
                          <button onClick={()=>postReply(comment.id)} disabled={posting||!replyText.trim()}
                            style={{ padding:"7px 14px",background:"linear-gradient(135deg,#c8973a,#e8b85a)",border:"none",borderRadius:"3px",color:"#0a0a0a",fontFamily:"'Courier New',monospace",fontSize:"9px",fontWeight:900,letterSpacing:"0.1em",textTransform:"uppercase",cursor:"pointer" }}>
                            Reply →
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
