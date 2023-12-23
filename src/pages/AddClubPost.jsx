import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const PageContainer = styled.div`
  max-width: 600px;
  margin: auto;
`;

const FormContainer = styled.div`
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  margin-top: 20px;
`;

const InputGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
`;

const AddButton = styled.button`
  padding: 10px 20px;
  background-color: #3498db;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  resize: vertical; /* Allow vertical resizing */
`;

const RemoveButton = styled.button`
  padding: 10px 20px;
  background-color: #e74c3c;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 2rem;

  &:hover {
    background-color: #c0392b;
  }
`;

const AddClubPost = () => {
  const [title, setTitle] = useState("");
  // const [clubName, setClubName] = useState(JSON.parse(localStorage.getItem("user").clubName));
  const [description, setDescription] = useState("");
  const [coordinators, setCoordinators] = useState([
    { name: "", email: "", phone: "" },
  ]);
  const navigate = useNavigate();
  const auth = localStorage.getItem("user");

  const handleInputChange = (index, field, value) => {
    const updatedCoordinators = [...coordinators];
    updatedCoordinators[index][field] = value;
    setCoordinators(updatedCoordinators);
  };

  const handleAddCoordinator = () => {
    setCoordinators([...coordinators, { name: "", email: "", phone: "" }]);
  };

  const handleAddPost = async () => {
    console.log("Title:", title);
    console.log("Description:", description);
    console.log("Coordinators:", coordinators);
    const clubName = JSON.parse(auth).clubName
    const adminID = JSON.parse(auth)._id;

    try {
      const postData = { adminID,clubName, title, description, coordinators };
      console.log(postData);
      const response = await fetch("http://localhost:8000/admin/addClubPost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
        body: JSON.stringify(postData),
      });


      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();

      // Handle the response data as needed
      console.log("Post added successfully:", responseData);
      toast.success( "Post Created successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      console.error("Error adding post:", error.message);
    }
    navigate("/club/:clubPosts");
  };

  const handleRemoveCoordinator = (index) => {
    const updatedCoordinators = [...coordinators];
    updatedCoordinators.splice(index, 1);
    setCoordinators(updatedCoordinators);
  };

  return (
    <PageContainer>
      <h1>Add Club Post</h1>
      <FormContainer>
        <InputGroup>
          <Label>Title:</Label>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </InputGroup>
        <InputGroup>
          <Label>ClubName:</Label>
          <Input
            type="text"
            value={JSON.parse(auth).clubName}
            disabled
          />
        </InputGroup>
        <InputGroup>
          <Label>Description:</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </InputGroup>
        <h3>Staff Coordinators:</h3>
        {coordinators.map((coordinator, index) => (
          <div key={index}>
            <InputGroup>
              <Label>Name:</Label>
              <Input
                type="text"
                value={coordinator.name}
                onChange={(e) =>
                  handleInputChange(index, "name", e.target.value)
                }
              />
            </InputGroup>
            <InputGroup>
              <Label>Email:</Label>
              <Input
                type="text"
                value={coordinator.email}
                onChange={(e) =>
                  handleInputChange(index, "email", e.target.value)
                }
              />
            </InputGroup>
            <InputGroup>
              <Label>Phone:</Label>
              <Input
                type="text"
                value={coordinator.phone}
                onChange={(e) =>
                  handleInputChange(index, "phone", e.target.value)
                }
              />
            </InputGroup>
            <RemoveButton onClick={() => handleRemoveCoordinator(index)}>
              Remove
            </RemoveButton>
          </div>
        ))}
        <AddButton onClick={handleAddCoordinator}>Add Coordinator</AddButton>
      </FormContainer>
      <FormContainer>
        <AddButton onClick={handleAddPost}>Add Post</AddButton>
      </FormContainer>
    </PageContainer>
  );
};

export default AddClubPost;
