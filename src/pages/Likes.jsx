import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Spinner from "../ui/Spinner";
import ReactPaginate from "react-paginate";
import "./Pagination.css";

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const Th = styled.th`
  background-color: #3498db;
  color: #fff;
  padding: 10px;
  text-align: left;
`;

const Td = styled.td`
  border: 1px solid #ddd;
  padding: 10px;
`;

const ActionTd = styled(Td)`
  text-align: center;

  a {
    color: #3498db;
    text-decoration: none;
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

const Likes = () => {
  const [likedPosts, setLikedPosts] = useState([]);
  const auth = localStorage.getItem("user");
  const userID = JSON.parse(auth)._id;
  const [isLoading, setIsLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const usersPerPage = 10;
  const pagesVisited = pageNumber * usersPerPage;

  const displayUsers = likedPosts
    .slice(pagesVisited, pagesVisited + usersPerPage)
    .map((post, index) => {
      return (
        <tr key={post.postID}>
          <Td>{index + 1}</Td>
          <Td>{post.clubName}</Td>
          <Td>{post.title}</Td>
          <ActionTd>
            <Link to={`/posts/view/${post.postID}`}>View</Link>
          </ActionTd>
        </tr>
      );
    });

  useEffect(() => {
    const fetchLikedPosts = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/user/posts/like/${userID}`,
          {
            headers: {
              "Content-Type": "application/json",
              authorization: `bearer ${JSON.parse(
                localStorage.getItem("token")
              )}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setLikedPosts(data);
          setIsLoading(true);
        } else {
          console.error("Failed to fetch liked posts");
          setIsLoading(true);
        }
      } catch (error) {
        console.error("Error fetching liked posts:", error);
        setIsLoading(true);
      }
    };

    fetchLikedPosts();
  }, []);

  const pageCount = Math.ceil(likedPosts.length / usersPerPage);
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  return (
    <div>
      <h2>Liked Posts</h2>
      <Table>
        <thead>
          <tr>
            <Th>Sr No</Th>
            <Th>Club Name</Th>
            <Th>Title</Th>
            <Th>Action</Th>
          </tr>
        </thead>
        <tbody>{displayUsers}</tbody>
      </Table>
      {isLoading ? (
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
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export default Likes;
