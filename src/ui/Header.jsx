import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";

const StyledHeader = styled.header`
  background-color: var(--color-grey-0);
  padding: 1.2rem 4.8rem;
  border-bottom: 1px solid var(--color-grey-100);
  display:flex;
  justify-content:space-between;
`;

function Header() {
  const auth = localStorage.getItem("user");
  const navigate = useNavigate();

  function logout() {
    localStorage.clear();
    navigate("/Signup");
  }
  return (
    <StyledHeader>
      HEADER
      <Link onClick={logout} to="/login">
        Logout ({JSON.parse(auth).name})
      </Link>
    </StyledHeader>
  );
}

export default Header;
