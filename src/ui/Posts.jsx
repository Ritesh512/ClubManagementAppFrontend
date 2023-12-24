import React, { useEffect } from "react";
import styled from "styled-components";
import { CgProfile } from "react-icons/cg";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { VscComment } from "react-icons/vsc";
import { IoIosShareAlt } from "react-icons/io";
import { MdOutlineDataSaverOn } from "react-icons/md";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const CardContainer = styled.div`
  width: 800px;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  margin: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const LogoAndName = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ClubLogo = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 12px;
`;

const ClubName = styled.h3`
  margin: 0;
`;

const Description = styled.p`
  margin: 16px 0;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 2rem;
`;

const ActionButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  background-color: #3498db;
  ${"" /* color: #fff; */}
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #2980b9;
  }
`;

const StyledInput = styled.input`
  width: 80%;
  padding: 10px;
  margin-top: 10px;
  margin-bottom: 16px;
  border: 1px solid #ccc;
  border-radius: 20px;
  font-size: 16px;
  display: inline;

  &:focus {
    outline: none;
    border-color: #3498db; /* Change the border color on focus */
  }
`;

const CoordinatorInfoContainer = styled.div`
  display: flex;
  align-items: center;

  p {
    margin: 0;
    margin-right: 10px;
    margin-bottom: 10px;
  }
`;

const CommentsContainer = styled.div`
  margin-top: 20px;
`;

const CommentBox = styled.div`
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  padding: 10px;
  margin-bottom: 10px;
`;

const CommentAuthor = styled.span`
  font-weight: bold;
  margin-right: 5px;
`;

const Posts = ({
  id,
  title,
  description,
  coordinators,
  clubName,
  setHandleLike,
  setHandleSave,
  likeByUser,
  saveByUser,
}) => {
  const [isliked, setLike] = useState(likeByUser);
  const [iscomment, setIsComment] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [isSaved, setIsSaved] = useState(saveByUser);
  const navigate = useNavigate();
  const auth = localStorage.getItem("user");

  function handleiscomment() {
    setIsComment((iscomment) => !iscomment);
  }

  const fetchComments = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/user/comment/getComments/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `bearer ${JSON.parse(
              localStorage.getItem("token")
            )}`,
          },
        }
      ); // Replace with actual endpoint
      if (response.ok) {
        const data = await response.json();
        setComments(data);
        console.log(data);
      } else {
        console.error("Failed to fetch comments:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [iscomment]);

  async function addComment() {
    // alert(comment);
    console.log(comment);
    setIsComment((iscomment) => !iscomment);
    const userId = JSON.parse(auth)._id;
    const name = JSON.parse(auth).name;

    try {
      const response = await fetch(
        `http://localhost:8000/user/comment/addComment/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `bearer ${JSON.parse(
              localStorage.getItem("token")
            )}`,
          },
          body: JSON.stringify({ userId, name, comment }),
        }
      );

      if (response.ok) {
        // Comment added successfully, you can handle the response data here
        const updatedPost = await response.json();
        console.log("Comment added successfully:", updatedPost);
      } else {
        // Handle error cases
        console.error("Failed to add comment:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
    setComment("");
  }

  function handleShare() {
    const shareLink = `http://localhost:5173/posts/view/${id}`;

    navigator.clipboard
      .writeText(shareLink)
      .then(() => {
        toast.success("Link Copied", {
          position: toast.POSITION.TOP_RIGHT,
        });
      })
      .catch((error) => {
        console.error("Failed to copy link to clipboard", error);
      });
  }

  const handleLike = async () => {
    setHandleLike(isliked);
    setLike((like) => !like);
    const userID = JSON.parse(auth)._id;
    const postID = id;

    try {
      const response = await fetch("http://localhost:8000/user/userLike", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
        body: JSON.stringify({ userID, postID, clubName, title }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data); // You can handle the response data as needed
      } else {
        console.error("Failed to like the post");
      }
    } catch (error) {
      console.error("Error while liking the post:", error);
    }
  };

  const handleSavePost = async () => {
    setHandleSave();
    setIsSaved((save) => !save);
    // if(isSaved) return ;
    const userID = JSON.parse(auth)._id;
    const postID = id;

    try {
      const response = await fetch("http://localhost:8000/user/saveUserPost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
        body: JSON.stringify({ userID, postID, clubName, title }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data); // You can handle the response data as needed
      } else {
        console.error("Failed to save the post");
      }
    } catch (error) {
      console.error("Error while saving the post:", error);
    }
  };

  return (
    <CardContainer>
      <LogoAndName>
        <CgProfile style={{ fontSize: "3rem" }} />
        <ClubName>{clubName || <Skeleton />}</ClubName>
      </LogoAndName>

      <h3>{title || <Skeleton />}</h3>
      <Description>{description || <Skeleton count={8} />}</Description>

      {coordinators.length > 0 &&
        coordinators.map((cor, key) => (
          <CoordinatorInfoContainer key={cor.id}>
            <p>Contact {key + 1}: </p>
            <p>{cor.name}</p>
            <p>{cor.email}</p>
            <p>{cor.phone}</p>
          </CoordinatorInfoContainer>
        ))}

      <Actions>
        {!isliked ? (
          <ActionButton onClick={handleLike}>
            <AiOutlineLike style={{ fontSize: "2rem" }} />
          </ActionButton>
        ) : (
          <ActionButton onClick={handleLike}>
            <AiFillLike style={{ fontSize: "2rem" }} />
          </ActionButton>
        )}

        <ActionButton onClick={handleiscomment}>
          <VscComment style={{ fontSize: "2rem" }} />
        </ActionButton>

        {!isSaved ? (
          <ActionButton onClick={handleSavePost}>
            <FaRegBookmark style={{ fontSize: "2rem" }} />
          </ActionButton>
        ) : (
          <ActionButton onClick={handleSavePost}>
            <FaBookmark style={{ fontSize: "2rem" }} />
          </ActionButton>
        )}

        <ActionButton onClick={handleShare}>
          <IoIosShareAlt style={{ fontSize: "2rem" }} />
        </ActionButton>
        <ActionButton>Join</ActionButton>
      </Actions>
      {iscomment ? (
        <div>
          <>
            <StyledInput
              type="text"
              placeholder="Your comment....!"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <ActionButton onClick={addComment}>Add</ActionButton>
          </>
          {comments.length > 0 && (
            <CommentsContainer>
              <h3>Top Comments</h3>
              {comments.slice(0, 2).map((c) => (
                <CommentBox key={c._id}>
                  <p>
                    <CommentAuthor>{c.name}:</CommentAuthor> {c.comment}
                    <span style={{ float: "right", color: "#888" }}>
                      {formatDate(c.date)}
                    </span>
                  </p>
                </CommentBox>
              ))}
            </CommentsContainer>
          )}
        </div>
      ) : (
        ""
      )}
    </CardContainer>
  );
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};

export default Posts;
