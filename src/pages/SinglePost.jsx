import React, { useEffect } from "react";
import styled from "styled-components";
import { CgProfile } from "react-icons/cg";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { VscComment } from "react-icons/vsc";
import { FiShare2 } from "react-icons/fi";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";

import { MdOutlineDataSaverOn } from "react-icons/md";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Spinner from "../ui/Spinner";

const CardContainer = styled.div`
  width: 600px;
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

const SinglePost = () => {
  const [isliked, setLike] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [iscomment, setIsComment] = useState(false);
  const [comment, setComment] = useState("");
  const { id } = useParams();

  const [likedPostsSet, setLikedPostsSet] = useState(new Set());
  const [savedPostsSet, setSavedPostsSet] = useState(new Set());

  const user = JSON.parse(localStorage.getItem("user"));
  const userData = JSON.parse(localStorage.getItem("userData"));

  const [clubPost, setClubPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClubPostDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8000/user/clubpost/getbyId/${id}`,{
          headers: {
            "Content-Type": "application/json",
            authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setClubPost(data.clubPost);
        setLoading(false);

        if(user.role==="user"){
          setLikedPostsSet(new Set(userData.likedPostIds));
          setSavedPostsSet(new Set(userData.savedPostIds));
        }
        // setLike(userData.likedPostIds.has(data.clubPost._id));
      } catch (error) {
        console.error("Error fetching club post details:", error);
      }
    };
    fetchClubPostDetails();
  }, []);

  function handleiscomment() {
    setIsComment((iscomment) => !iscomment);
  }

  function addComment() {
    alert(comment);
    console.log(comment);
    setIsComment((iscomment) => !iscomment);
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

  if (loading) {
    return <Spinner />;
  }

  return (
    <CardContainer>
      <LogoAndName>
        <CgProfile style={{ fontSize: "3rem" }} />
        <ClubName>{clubPost.clubName}</ClubName>
      </LogoAndName>
      <h3>{clubPost.title}</h3>
      <Description>{clubPost.description}</Description>
      {clubPost.coordinators.map((cor, key) => (

        <CoordinatorInfoContainer key={cor.id}>
          <p>Contact {key + 1}: </p>
          <p>{cor.name}</p>
          <p>{cor.email}</p>
          <p>{cor.phone}</p>
        </CoordinatorInfoContainer>
      ))}
      <Actions>
        {user.role === "user" && (
          <ActionButton onClick={(e) => setLike(!isliked)}>
            {likedPostsSet.has(clubPost._id) ? (
              <AiFillLike style={{ fontSize: "2rem" }} />
            ) : (
              <AiOutlineLike style={{ fontSize: "2rem" }} />
            )}
          </ActionButton>
        )}

        <ActionButton onClick={handleiscomment}>
          <VscComment style={{ fontSize: "2rem" }} />
        </ActionButton>
        {user.role === "user" && (
          <ActionButton onClick={(e) => setIsSaved(!isSaved)}>
            {!savedPostsSet.has(clubPost._id) ? (
              <FaRegBookmark style={{ fontSize: "2rem" }} />
            ) : (
              <FaBookmark style={{ fontSize: "2rem" }} />
            )}
          </ActionButton>
        )}

        <ActionButton onClick={handleShare}>
          <FiShare2 style={{ fontSize: "2rem" }} />
        </ActionButton>
        {user.role === "user" && <ActionButton>Join</ActionButton>}
      </Actions>
      {iscomment ? (
        <>
          <StyledInput
            type="text"
            placeholder=".....Your comment"
            onChange={(e) => setComment(e.target.value)}
          />
          <ActionButton onClick={addComment}>Add</ActionButton>
        </>
      ) : (
        ""
      )}
    </CardContainer>
  );
};

export default SinglePost;
