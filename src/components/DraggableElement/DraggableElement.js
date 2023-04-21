import React from "react";
import ReactDOM from "react-dom";
import "./DraggableElement.css";

// Kiểm tra xem 1 element có vượt quá chiều rộng của container không
const isOverflowedX = (elm) => elm.scrollWidth > elm.clientWidth;

// Kiểm tra xem 1 element có vượt quá chiều cao của container không
const isOverflowedY = (elm) => elm.scrollHeight > elm.clientHeight;

/**
 * Nếu 1 element có chiều rộng vượt quá container,
 * thì sẽ thêm scrollbar theo chiều X
 */
const addScrollbarXIfNeeded = (elm) => {
  if (isOverflowedX(elm)) elm.style.setProperty("overflow-x", "scroll");
  else elm.style.setProperty("overflow-x", "initial");
};

/**
 * Nếu 1 element có chiều cao vượt quá container,
 * thì sẽ thêm scrollbar theo chiều Y
 */
const addScrollbarYIfNeeded = (elm) => {
  if (isOverflowedY(elm)) elm.style.setProperty("overflow-y", "scroll");
  else elm.style.setProperty("overflow-y", "initial");
};

/**
 * Cross-browser để xác định clientWidth cho IE8 trở về trước
 * Draggable Element chỉ cho phép di chuyển phần tử
 * ở trong phạm vi màn hình
 */
const maxWidth =
  window.innerWidth ||
  document.documentElement.clientWidth ||
  document.body.clientWidth;

/**
 * Cross-browser để xác định clientHeight cho IE8 trở về trước
 * Draggable Element chỉ cho phép di chuyển phần tử
 * ở trong phạm vi màn hình
 */
const maxHeight =
  window.innerHeight ||
  document.documentElement.clientHeight ||
  document.body.clientHeight;

/**
 * React Component cho phép di chuyển 1 phần tử
 * trong phạm vi màn hình.
 * Hiện tại chỉ support di chuyển trên Desktop,
 * chưa support trên điện thoại
 */
export default class DraggableElement extends React.Component {
  constructor(props) {
    super(props);

    // Bind các phương thức để sử dụng phía dưới
    this.dragMouseDown = this.dragMouseDown.bind(this);
    this.elementDrag = this.elementDrag.bind(this);
    this.closeDragElement = this.closeDragElement.bind(this);
  }

  /**
   * Hàm này được gọi khi component render xong lên màn hình
   */
  componentDidMount() {
    // Lấy ra DOM node của đối tượng root - toàn bộ component
    this.root = ReactDOM.findDOMNode(this);

    // Lấy ra DOM node của content - vùng chứa nội dung
    this.content = this.root.querySelector(".content");

    /**
     * Lấy ra DOM node của header - vùng cho phép click chuột
     * để di chuyển
     */
    this.header = this.root.querySelector(".header");

    /**
     * Tính lại chiều cao cho vùng content,
     * chiều rộng của content luôn = 100% giá trị của root
     */
    const height = this.root.offsetHeight - this.header.offsetHeight;
    this.content.style.height = `${height}px`;

    /**
     * Sau đó, thêm scrollbar vào content,
     * nếu nội dung vượt quá kích thước của vùng
     */
    addScrollbarXIfNeeded(this.content);
    addScrollbarYIfNeeded(this.content);

    // Đăng ký sự kiện khi người dùng click chuột vào header
    this.header.addEventListener("mousedown", this.dragMouseDown);
  }

  componentWillUnmount() {
    // Huỷ đăng ký sự kiện khi người dùng click chuột vào header
    this.header.removeEventListener("mousedown", this.dragMouseDown);
  }

  /**
   * Hàm này xử lý khi người dùng click chuột vào header,
   * do đó đối số e - tương ứng với đối tượng MouseEvent
   */
  dragMouseDown(e) {
    // Huỷ bỏ tất cả các xử lý mặc định, nếu có
    e.preventDefault();

    /**
     * Lấy ra vị trí click chuột đầu tiên,
     * Mục đích là khi người dùng di chuyển,
     * mình sẽ tính vị trí chuột mới.
     * Sau đó, lấy giá vị trí mới trừ đi giá trị vị trí cũ,
     * sẽ tính được khoảng di chuyển của chuột
     * => cập nhật lại toạ độ cho Component
     */
    this.startX = e.clientX;
    this.startY = e.clientY;

    // Đăng ký sự kiện mousemove, để xử lý khi di chuyển chuột
    window.addEventListener("mousemove", this.elementDrag);

    /**
     * Đăng ký sự kiện mouseup, để xử lý khi người dùng nhả chuột.
     * Lúc này, đồng nghĩa với việc dừng di chuyển Component.
     */
    window.addEventListener("mouseup", this.closeDragElement);
  }

  /**
   * Xử lý khi người dùng đã click chuột vào header của component
   * và đang di chuyển => đối số e - là MouseEvent
   */
  elementDrag(e) {
    // Huỷ bỏ tất cả các xử lý mặc định, nếu có
    e.preventDefault();

    /**
     * Lúc này, mình cũng tính được vị trí của chuột hiện tại,
     * chính là e.clientX và e.clientY.
     * Sau đó, lấy giá trị cũ (this.startX, this.startY) trừ đi
     * giá trị mới là tính được khoảng di chuyển.
     */
    const deltaX = this.startX - e.clientX;
    const deltaY = this.startY - e.clientY;

    // Tính toán vị trí top, left, right, bottom mới của component
    const newTop = this.root.offsetTop - deltaY;
    const newLeft = this.root.offsetLeft - deltaX;
    const newRight = newLeft + this.root.offsetWidth;
    const newBottom = newTop + this.root.offsetHeight;

    /**
     * Kiểm tra thử xem ứng với vị trí mới này,
     * component có nằm trong chiều rộng màn hình không,
     * Nếu có, thì mới cập nhật vị trí mới
     */
    if (
      newLeft >= 0 &&
      newLeft <= maxWidth &&
      newRight >= 0 &&
      newRight <= maxWidth
    ) {
      this.startX = e.clientX;
      this.root.style.left = `${newLeft}px`;
    }

    /**
     * Kiểm tra thử xem ứng với vị trí mới này,
     * component có nằm trong chiều cao màn hình không,
     * Nếu có, thì mới cập nhật vị trí mới
     */
    if (
      newTop >= 0 &&
      newTop <= maxHeight &&
      newBottom >= 0 &&
      newBottom <= maxHeight
    ) {
      this.startY = e.clientY;
      this.root.style.top = `${newTop}px`;
    }
  }

  /**
   * Hàm này xử lý khi người dùng nhả chuột - ngừng di chuyển,
   * Mình phải huy các sự kiện mouseup và mousemove đã đăng ký
   */
  closeDragElement() {
    window.removeEventListener("mouseup", this.closeDragElement);
    window.removeEventListener("mousemove", this.elementDrag);
  }

  render() {
    const title = this.props.title || "Click here to move";
    const elemStyle = {
      width: `${this.props.width || 300}px`,
      height: `${this.props.height || 300}px`,
      top: `${this.props.top || 0}px`,
      left: `${this.props.left || 0}px`,
      bottom: `${this.props.bottom || 0}px`,
      right: `${this.props.right || 0}px`
    };

    return (
      <div className="lp-draggable-element" style={elemStyle}>
        <div className="header">{title}</div>
        <div className="content">{this.props.children}</div>
      </div>
    );
  }
}