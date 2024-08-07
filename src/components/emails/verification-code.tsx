type VerificationCodeProps = {
  code: string;
};
function VerificationCode({ code }: VerificationCodeProps) {
  return (
    <div>
      <p>Enter the verification code below to complete your registration.</p>
      <p>{code}</p>
    </div>
  );
}
export default VerificationCode;
