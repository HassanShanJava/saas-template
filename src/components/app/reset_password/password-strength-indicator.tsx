import "./password-strength-indicator.css";

export default function PasswordStrengthIndicator({ passwordStrength }) {
  return (
    <span>
      <ul id="passwordStrength" className="list-disc pl-6">
        <li id="Length" className="glyphicon glyphicon-remove">
          Must be at least 7 charcters
        </li>
        <li id="UpperCase" className="glyphicon glyphicon-remove">
          Must have atleast 1 upper case character
        </li>
        <li id="LowerCase" className="glyphicon glyphicon-remove">
          Must have atleast 1 lower case character
        </li>
        <li id="Numbers" className="glyphicon glyphicon-remove">
          Must have atleast 1 numeric character
        </li>
        <li id="Symbols" className="glyphicon glyphicon-remove">
          Must have atleast 1 special character
        </li>
      </ul>
    </span>
  );
}

PasswordStrengthIndicator.defaultProps = {
  handleLevelChange: () => {}
};
