import styled from "@emotion/styled";
import Image from "next/image";
import brandLogo from "../public/images/lacrypta-title.svg";

const Container = styled.div`
  width: 100%;
  margin-bottom: 2em;
`;

export const HeaderLogo = () => {
  return (
    <Container>
      <Image alt='La Crypta bar' src={brandLogo} />
    </Container>
  );
};
