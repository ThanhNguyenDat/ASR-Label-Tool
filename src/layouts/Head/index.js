import useScript from "../../hooks/useScript";

function Header() {
  useScript({ url: "header", head: true });
  return (
    <div>
      <head>Header</head>
    </div>
  );
}

export default Header;
