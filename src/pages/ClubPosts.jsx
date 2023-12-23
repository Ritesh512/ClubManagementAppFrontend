import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../ui/Spinner";

// Sample data for club posts
const clubPostsData = [
  { srno: 1, title: "Post 1", date: "2023-01-01" },
  { srno: 2, title: "Post 2", date: "2023-02-01" },
  // Add more posts as needed
];

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const Th = styled.th`
  padding: 10px;
  background-color: #f2f2f2;
  text-align: left;
`;

const Td = styled.td`
  padding: 10px;
  border: 1px solid #ddd;
`;

const Button = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  margin-right: 5px;

  &:hover {
    background-color: #45a049;
  }
`;

function formatDateString(inputDateString) {
  const options = { day: "numeric", month: "short", year: "numeric" };
  const date = new Date(inputDateString);
  return date.toLocaleDateString("en-US", options);
}

const ClubPosts = () => {
  const navigate = useNavigate();
  const auth = localStorage.getItem("user");
  const [post, setPost] = useState([]);
  const [isLoading,setIsLoading] = useState(false);

  const handleTitleClick = (postId) => {
    // Redirect to the post details page with postId
    navigate(`/posts/view/${postId}`);
  };

  useEffect(() => {
    const fetchAdminPosts = async () => {
      const adminID = JSON.parse(auth)._id;
      try {
        const response = await fetch(
          `http://localhost:8000/admin/adminPosts/${adminID}`,{
            headers: {
              "Content-Type": "application/json",
              authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
            },
          });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setPost(data.posts);
        setIsLoading(true);
        
      } catch (error) {
        console.error("Error fetching admin posts:", error);
        setIsLoading(false);
      }
    };

    fetchAdminPosts();
  }, []);

  const deleteClubPost = async (postId) => {
    console.log(postId);
    try {
      const response = await fetch(
        `http://localhost:8000/admin/delete/clubPosts/${postId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log(result.message); // Log the success message
        toast.success("Post Deleted", {
          position: toast.POSITION.TOP_RIGHT,
          onClose: () => {
            setTimeout(() => {
              window.location.reload();
            }, 5000);
          },
        });
      } else {
        const error = await response.json();
        console.error(`Error: ${error.error}`); // Log the error message
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  function handleEdit(postId) {
    navigate(`/club/${JSON.parse(auth).clubName}/post/edit/${postId}`);
  }

  if(!isLoading) return <Spinner />

  return (
    <div>
      <h2>Club Posts</h2>
      <Table>
        <thead>
          {post.length>0 && <tr>
            <Th>Sr. No.</Th>
            <Th>Title</Th>
            <Th>Date of Creation</Th>
            <Th>Edit</Th>
            <Th>Delete</Th>
          </tr>}
        </thead>
        <tbody>
          {post.length > 0 ? (
            post.map((post, index) => (
              <tr key={post.srno}>
                <Td>{index + 1}</Td>
                <Td
                  onClick={() => handleTitleClick(post.postId)}
                  style={{
                    cursor: "pointer",
                    color: "blue",
                    textDecoration: "none",
                  }}
                >
                  {post.title}
                </Td>
                <Td>{formatDateString(post.date)}</Td>
                <Td>
                  <Button onClick={() => handleEdit(post.postId)}>Edit</Button>
                </Td>
                <Td>
                  <Button onClick={() => deleteClubPost(post.postId)}>
                    Delete
                  </Button>
                </Td>
              </tr>
            ))
          ) : (
            <h1>Create Your Club Post</h1>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default ClubPosts;
