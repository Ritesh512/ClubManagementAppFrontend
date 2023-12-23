import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../ui/Spinner";
import ReactPaginate from "react-paginate";
import "./Pagination.css";

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

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;

const PaginationButton = styled.a`
  cursor: pointer;
  margin: 0 5px;
  padding: 8px 16px;
  background-color: #3498db;
  color: #fff;
  text-decoration: none;
  border-radius: 4px;

  &:hover {
    background-color: #2980b9;
  }
`;

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
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
  const [isLoading, setIsLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const postsPerPage = 5;

  const handleTitleClick = (postId) => {
    // Redirect to the post details page with postId
    navigate(`/posts/view/${postId}`);
  };

  useEffect(() => {
    const fetchAdminPosts = async () => {
      const adminID = JSON.parse(auth)._id;
      try {
        const response = await fetch(
          `http://localhost:8000/admin/get/adminPosts/${adminID}`,
          {
            headers: {
              "Content-Type": "application/json",
              authorization: `bearer ${JSON.parse(
                localStorage.getItem("token")
              )}`,
            },
          }
        );

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
            authorization: `bearer ${JSON.parse(
              localStorage.getItem("token")
            )}`,
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

  const pageCount = Math.ceil(post.length / postsPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  if (!isLoading) return <Spinner />;

  return (
    <div>
      <h2>Club Posts</h2>
      <Table>
        <thead>
          {post.length > 0 && (
            <tr>
              <Th>Sr. No.</Th>
              <Th>Title</Th>
              <Th>Date of Creation</Th>
              <Th>Edit</Th>
              <Th>Delete</Th>
            </tr>
          )}
        </thead>
        <tbody>
          {post.length > 0 ? (
            post
              .slice(pageNumber * postsPerPage, (pageNumber + 1) * postsPerPage)
              .map((post, index) => (
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
                    <Button onClick={() => handleEdit(post.postId)}>
                      Edit
                    </Button>
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
      <PaginationWrapper>
        <PaginationContainer>
          <ReactPaginate
            nextLabel="next >"
            onPageChange={changePage}
            pageCount={pageCount}
            previousLabel="< previous"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            breakLabel="..."
            breakClassName="page-item"
            breakLinkClassName="page-link"
            containerClassName="pagination"
            activeClassName="active"
            renderOnZeroPageCount={null}
          />
        </PaginationContainer>
      </PaginationWrapper>
    </div>
  );
};

export default ClubPosts;
