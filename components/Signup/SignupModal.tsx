import styled from "@emotion/styled";
import {
  Alert,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Fade,
  Modal,
  TextField,
} from "@mui/material";
import { generatePermitData } from "../../lib/public/utils";

import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import useERC20Permit from "../../hooks/useERC20Permit";
import useUser from "../../hooks/useUser";

import useGateway from "../../plugins/gateway/hooks/useGateway";
import useLoading from "../../hooks/useLoading";

const BoxDiv = styled(Box)`
  position: fixed;
  top: 10%;
  left: 50%;
  transform: translate(-50%, 0%);
  width: 600px;
  max-width: 90%;
  background: white;
  border: 2px solid #fff;
  box-shadow: 24;
  padding: 15px;
  color: black;
`;

const ButtonDiv = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
`;

const InputDiv = styled.div`
  padding: 0px;
  width: 100%;
  & input,
  div {
    width: 100%;
    font-size: 22px;
    font-variant-caps: all-petite-caps;
  }
`;

interface IPaymentModalProps {
  open: boolean;
  // eslint-disable-next-line no-unused-vars
  setOpen: (args0: boolean) => void;
}

const SignupModal = ({ open, setOpen }: IPaymentModalProps) => {
  // Contexts
  const { address } = useAccount();
  const { signup } = useUser();
  const { requestSignature } = useERC20Permit();
  const { contract: gatewayContract } = useGateway();
  const { setActive } = useLoading();

  // Local Hooks
  const [username, setUsername] = useState("");
  const [isSignatureLoading, setSignatureLoading] = useState(false);
  // const [error, setError] = useState(""); // TODO: Show error

  // Environment variables
  const contractAddress = process.env.NEXT_PUBLIC_PERONIO_CONTRACT;
  const signupTTL = process.env.NEXT_PUBLIC_SIGNUP_TTL ?? "0";

  const gatewayAddress = gatewayContract?.address;

  useEffect(() => {
    if (open) {
      setUsername("");
    }
  }, [open]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleSignup = async () => {
    setSignatureLoading(true);
    setActive(true);
    const permitData = generatePermitData(
      contractAddress,
      gatewayAddress,
      signupTTL
    );
    try {
      const signature = await requestSignature(permitData);
      await signup({
        address: address ?? "",
        username,
        permitData,
        signature,
      });
    } catch (e: any) {
      console.info("Modal closed");
    }

    setActive(false);
    setSignatureLoading(false);
  };

  const handleInput = (event: { target: { value: any } }) => {
    setUsername(event.target.value);
  };

  return (
    <Modal
      aria-labelledby='transition-modal-title'
      aria-describedby='transition-modal-description'
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <BoxDiv>
          <div>
            <h2>Ingresá tu Sobrenombre</h2>
          </div>

          <Alert severity='info'>
            Van a llamarte con este nombre cuando esté listo tu pedido
          </Alert>

          <div>
            <InputDiv>
              <TextField
                required
                size='medium'
                label='Nombre'
                value={username}
                disabled={isSignatureLoading}
                onChange={handleInput}
              />
            </InputDiv>
            {/* <TermsCheckbox
              checked={checkedTerms}
              disabled={isSignatureLoading}
              onChange={(_e: any, v: boolean) => setCheckedTerms(v)}
            /> */}
          </div>

          <ButtonDiv>
            {isSignatureLoading ? (
              <CircularProgress
                variant='indeterminate'
                size={40}
                thickness={4}
                value={100}
              />
            ) : (
              <Button
                size='large'
                variant='contained'
                onClick={handleSignup}
                // disabled={!checkedTerms}
                endIcon={<AssignmentTurnedInIcon />}
              >
                Registrarse
              </Button>
            )}
          </ButtonDiv>
        </BoxDiv>
      </Fade>
    </Modal>
  );
};

export default SignupModal;
