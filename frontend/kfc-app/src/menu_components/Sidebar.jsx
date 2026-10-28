import smoothScrollTo from "../utils/smoothScrollTo";
import styles from "./item.module.css";
import menuLogo from "../assets/svg/menu5.svg";

export const Sidebar = ({ categories = [] }) => (
  <aside className={styles.sidebox}>
    <img src={menuLogo} alt="KFC menu stripes" />
    <h1>KFC MENU</h1>
    {categories.map((category) => (
      <button
        type="button"
        key={category.id}
        onClick={() => smoothScrollTo(category.id)}
      >
        {category.title}
      </button>
    ))}
  </aside>
);

export default Sidebar;
