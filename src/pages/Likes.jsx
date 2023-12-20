// import Heading from "../ui/Heading";
// import Row from "../ui/Row";

// function Likes() {
//   return (
//     <Row type="horizontal">
//       <Heading as="h1">All Likes</Heading>
//       <p>TEST</p>
//     </Row>
//   );
// }

// export default Likes;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

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

const Likes = () => {
  const [likedPosts, setLikedPosts] = useState([]);
  const auth = localStorage.getItem("user");  
  const userID = JSON.parse(auth)._id; 

  useEffect(() => {
    const fetchLikedPosts = async () => {
      try {
        const response = await fetch(`http://localhost:8000/likedPosts/${userID}`);
        if (response.ok) {
          const data = await response.json();
          setLikedPosts(data);
          console.log(data);
        } else {
          console.error('Failed to fetch liked posts');
        }
      } catch (error) {
        console.error('Error fetching liked posts:', error);
      }
    };

    fetchLikedPosts();
  }, []);

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
        <tbody>
          {likedPosts.map((post, index) => (
            <tr key={post.postID}>
              <Td>{index + 1}</Td>
              <Td>{post.clubName}</Td>
              <Td>{post.title}</Td>
              <ActionTd>
                <Link to={`/posts/${post.postID}`}>View</Link>
              </ActionTd>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Likes;
