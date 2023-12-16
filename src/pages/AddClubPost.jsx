import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

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
  margin-bottom:2rem;

  &:hover {
    background-color: #c0392b;
  }
`;


const AddClubPost = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coordinators, setCoordinators] = useState([{ name: '', email: '', phone: '' }]);
  const navigate = useNavigate();

  const handleInputChange = (index, field, value) => {
    const updatedCoordinators = [...coordinators];
    updatedCoordinators[index][field] = value;
    setCoordinators(updatedCoordinators);
  };

  const handleAddCoordinator = () => {
    setCoordinators([...coordinators, { name: '', email: '', phone: '' }]);
  };

  const handleAddPost = () => {
    console.log('Title:', title);
    console.log('Description:', description);
    console.log('Coordinators:', coordinators);
    navigate("/");
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
                onChange={(e) => handleInputChange(index, 'name', e.target.value)}
              />
            </InputGroup>
            <InputGroup>
              <Label>Email:</Label>
              <Input
                type="text"
                value={coordinator.email}
                onChange={(e) => handleInputChange(index, 'email', e.target.value)}
              />
            </InputGroup>
            <InputGroup>
              <Label>Phone:</Label>
              <Input
                type="text"
                value={coordinator.phone}
                onChange={(e) => handleInputChange(index, 'phone', e.target.value)}
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
