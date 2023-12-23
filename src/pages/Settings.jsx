import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f4f4f4;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const Section = styled.div`
  margin-bottom: 20px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  flex: 1;
  margin-right: 20px;
  font-weight: bold;
`;

const Value = styled.p`
  flex: 2;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  font-size: 16px;
  margin:10px
`;

const Button = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;

const Settings = () => {
  const auth = JSON.parse(localStorage.getItem("user"));
  const [name, setName] = useState(auth.name);
  const [email, setEmail] = useState(auth.email);
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const navigate = useNavigate();

  const handleChangePassword = async () => {
    if(newPassword!==confirmNewPassword){
      toast.warning("Password and confirm Password is not same", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return ;
    }
    try {
      const userId = auth._id; 
      const role = auth.role;
      const response = await fetch('http://localhost:8000/changePassword', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
        body: JSON.stringify({
          userId,
          password,
          newPassword,
          role,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        console.error('Error changing password:', data.error);
      } else {
        console.log('Password changed successfully');
        toast.success("Password changed successfully", {
          position: toast.POSITION.TOP_RIGHT,
        });
        navigate("/");
      }
    } catch (error) {
      console.error('Error changing password:', error);
    }
  };

  return (
    <Container>
      <Section>
        <Row>
          <Label>Name:</Label>
          <Value>{name}</Value>
        </Row>
        <Row>
          <Label>Email:</Label>
          <Value>{email}</Value>
        </Row>
      </Section>
      <Section>
        <h2>Change Password</h2>
        <Input
          type="password"
          placeholder="Current Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Confirm New Password"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
        />
        <Button onClick={handleChangePassword}>Change Password</Button>
      </Section>
    </Container>
  );
};

export default Settings;
