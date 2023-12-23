import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import ReactPaginate from "react-paginate";
import "./Pagination.css";

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

const JoinButton = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 3px;
  cursor: pointer;

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

const Clubs = () => {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const userClub = JSON.parse(localStorage.getItem("userClub"));
  const [clubUser, setClubUser] = useState(new Set());
  const [pageNumber, setPageNumber] = useState(0);
  const clubsPerPage = 5;

  useEffect(() => {
    const userID = user._id;
    const fetchAdmins = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/user/getClubName/${userID}`,
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
        setAdmins(data.formattedAdmins);
        setClubUser(new Set(data.userDetails));
      } catch (error) {
        console.error("Error fetching admins:", error);
      }
    };

    fetchAdmins();
  }, []);

  const showToastAndReload = () => {
    toast.success("Joined to the Club", {
      position: toast.POSITION.TOP_RIGHT,
      onClose: () => {
        // Reload the page after the toast is closed
        window.location.reload();
      },
    });
  };

  async function handleJoinClick(clubID, clubName) {
    const userID = user._id;
    try {
      const response = await fetch("http://localhost:8000/user/join/club", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `bearer ${JSON.parse(
            localStorage.getItem("token")
          )}`,
        },
        body: JSON.stringify({
          userID,
          clubID,
          clubName,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Success:", data.message);
      toast.success("Joined to the Club", {
        position: toast.POSITION.TOP_RIGHT,
        onClose: () => {
          // Reload the page after the toast is closed
          setTimeout(() => {
            window.location.reload();
          }, 5000);
        },
      });
    } catch (error) {
      console.error("Error adding club:", error.message);
    }
  }

  const pageCount = Math.ceil(admins.length / clubsPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  return (
    <div>
      <h2>Clubs Page</h2>
      <Table>
        <thead>
          <tr>
            <Th>Sr. No.</Th>
            <Th>Club Name</Th>
            <Th>Admin</Th>
            <Th>Email</Th>
            <Th>Join</Th>
          </tr>
        </thead>
        <tbody>
          {admins
            .slice(pageNumber * clubsPerPage, (pageNumber + 1) * clubsPerPage)
            .map((club, index) => (
              <tr key={club.srno}>
                <Td>{index + 1}</Td>
                <Td>{club.clubName}</Td>
                <Td>{club.admin}</Td>
                <Td>{club.email}</Td>
                <Td>
                  {clubUser.has(club.id) ? (
                    <JoinButton
                      onClick={() => {
                        toast.warning("Already a Member", {
                          position: toast.POSITION.TOP_RIGHT,
                          autoClose: 1000,
                        });
                      }}
                    >
                      Joined
                    </JoinButton>
                  ) : (
                    <JoinButton
                      onClick={() => handleJoinClick(club.id, club.clubName)}
                    >
                      Join
                    </JoinButton>
                  )}
                </Td>
              </tr>
            ))}
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

export default Clubs;
