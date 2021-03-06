import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ButtonNext } from "./styles/Button.styled";
import { ContentRightStyled } from "./styles/Container.styled";
import {
  OptionDetails,
  OptionPrice,
  SummaryInfo,
  SummarySeparator,
  TotalPrice,
} from "./styles/Summary.styled";
import NumberFormat from "react-number-format";
import { nextStep } from "../redux/step/stepAction";
import {
  chooseShipment,
  genOrderID,
  setButton,
} from "../redux/user/userAction";

export default function ContentRight() {
  const activeStep = useSelector((state) => state.step.activeStep);
  const dropship = useSelector((state) => state.user.dropship);
  const choosenShipment = useSelector((state) => state.user.shipment);
  const choosenPayment = useSelector((state) => state.user.payment);
  const buttonNextState = useSelector((state) => state.user.button);

  const {
    provider: courier,
    timeEstimation: timeDelivery,
    fee: courierFee,
  } = choosenShipment || {};

  const { provider: bank } = choosenPayment || {};

  const costGoods = 500000;
  const dropshipFee = 5900;
  const totalFee = costGoods + (dropship ? dropshipFee : 0) + (courierFee || 0);

  const dispatch = useDispatch();
  const handleNextButton = () => {
    if (activeStep === 2) {
      dispatch(genOrderID());
    }
    dispatch(nextStep());
  };

  useEffect(() => {
    if (activeStep === 2 && choosenPayment) {
      dispatch(setButton(true));
    }
  }, [choosenPayment, dropship, activeStep, dispatch]);

  const handleTextButton = () => {
    switch (activeStep) {
      case 1:
        return "Continue to Payment";
      case 2:
        return `${
          !choosenShipment
            ? "Choose shipment first"
            : choosenPayment
            ? `Pay with ${bank}`
            : "Choose payment first"
        }`;
      case 3:
        return "";
      default:
        return;
    }
  };

  return (
    <ContentRightStyled>
      <div id="content-right-top">
        <SummaryInfo>
          <h2>Summary</h2>
          <p>10 items purchased</p>
        </SummaryInfo>
        {choosenShipment && activeStep > 1 && (
          <>
            <SummarySeparator />
            <OptionDetails>
              <h3>Delivery Estimation</h3>
              <p>
                {timeDelivery} by {courier}
              </p>
            </OptionDetails>
          </>
        )}
        {activeStep === 3 && (
          <>
            <SummarySeparator />
            <OptionDetails>
              <h3>Payment Method</h3>
              <p>{bank}</p>
            </OptionDetails>
            <SummarySeparator />
          </>
        )}
      </div>
      <div id="content-right-bottom">
        <OptionPrice>
          <p>Cost of goods</p>
          <p>
            <NumberFormat
              value={costGoods}
              displayType={"text"}
              thousandSeparator={true}
              prefix={`Rp `}
              className="font-bold"
            />
          </p>
        </OptionPrice>
        {dropship && (
          <OptionPrice>
            <p>Dropshipping Fee</p>
            <p>
              <NumberFormat
                value={dropshipFee}
                displayType={"text"}
                thousandSeparator={true}
                prefix={`Rp `}
                className="font-bold"
              />
            </p>
          </OptionPrice>
        )}
        {choosenShipment && (
          <OptionPrice>
            <p>
              <span>{courier}</span> Shipment
            </p>
            <p>
              <NumberFormat
                value={courierFee}
                displayType={"text"}
                thousandSeparator={true}
                prefix={`Rp `}
                className="font-bold"
              />
            </p>
          </OptionPrice>
        )}
        <TotalPrice step={activeStep}>
          <p>Total</p>
          <p>
            <NumberFormat
              value={totalFee}
              displayType={"text"}
              thousandSeparator={true}
              prefix={`Rp `}
              className="font-bold"
            />
          </p>
        </TotalPrice>
        {activeStep !== 3 && (
          <ButtonNext
            type={activeStep === 1 ? "submit" : "button"}
            form="form_delivery"
            onClick={
              activeStep === 2 && choosenPayment && chooseShipment
                ? handleNextButton
                : undefined
            }
            disableStyle={!buttonNextState}
          >
            {handleTextButton()}
          </ButtonNext>
        )}
      </div>
    </ContentRightStyled>
  );
}
