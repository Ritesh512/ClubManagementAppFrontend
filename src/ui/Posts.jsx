import React from "react";
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

const Posts = ({ id }) => {
  const [isliked, setLike] = useState(false);
  const [iscomment, setIsComment] = useState(false);
  const [comment, setComment] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const navigate = useNavigate();

  function handleiscomment() {
    setIsComment((iscomment) => !iscomment);
  }

  function addComment() {
    alert(comment);
    console.log(comment);
    setIsComment((iscomment) => !iscomment);
  }

  function handleShare() {
    const shareLink = `http://localhost:5173/dashboard/${id}`;

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

  return (
    <CardContainer>
      <LogoAndName>
        <CgProfile style={{ fontSize: "3rem" }} />
        <ClubName>Club Name</ClubName>
      </LogoAndName>
      
        <h3>Registration for Club</h3>
      <Description>
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry's standard dummy text ever
        since the 1500s, when an unknown printer took a galley of type and
        scrambled it to make a type specimen book. It has survived not only five
        centuries, but also the leap into electronic typesetting, remaining
        essentially unchanged.
      </Description>

      <CoordinatorInfoContainer>
      <p>Contact: </p>
        <p>Ritesh Prajapati</p>
        <p>ritesh@gmail.com</p>
        <p>9823175272</p>
      </CoordinatorInfoContainer>

      <Actions>
        {!isliked ? (
          <ActionButton onClick={(e) => setLike(!isliked)}>
            <AiOutlineLike style={{ fontSize: "2rem" }} />
          </ActionButton>
        ) : (
          <ActionButton onClick={(e) => setLike(!isliked)}>
            <AiFillLike style={{ fontSize: "2rem" }} />
          </ActionButton>
        )}

        <ActionButton onClick={handleiscomment}>
          <VscComment style={{ fontSize: "2rem" }} />
        </ActionButton>

        {!isSaved ? (
          <ActionButton onClick={(e) => setIsSaved(!isSaved)}>
            <FaRegBookmark style={{ fontSize: "2rem" }} />
          </ActionButton>
        ) : (
          <ActionButton onClick={(e) => setIsSaved(!isSaved)}>
            <FaBookmark style={{ fontSize: "2rem" }} />
          </ActionButton>
        )}

        <ActionButton onClick={handleShare}>
          <IoIosShareAlt style={{ fontSize: "2rem" }} />
        </ActionButton>
        <ActionButton>Join</ActionButton>
      </Actions>
      {iscomment ? (
        <>
          <StyledInput
            type="text"
            placeholder="Your comment....!"
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

export default Posts;
