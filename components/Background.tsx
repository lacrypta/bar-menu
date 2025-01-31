import styled from "@emotion/styled";
import { default as NextImage } from "next/image";

import svgSkin from "../public/images/skin.svg";

const BackgroundDiv = styled.div`
  height: auto;
  max-height: 100%;
  background: black;
  position: absolute;
  z-index: 9;
  width: 100%;
  top: 0;
  overflow: hidden;
`;

const Image = styled(NextImage)`
  width: 100%;
  opacity: 0.1;
  left: -17%;
`;

export const Background = () => {
  return (
    <BackgroundDiv>
      <Image priority={true} alt='skin' src={svgSkin} />
    </BackgroundDiv>
  );
};
