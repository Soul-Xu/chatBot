import Image from "next/image"
import ImgRobotIcon from "@/public/images/robot_icon.png"
import classnames from "classnames/bind"
import styles from "./index.module.scss"
const classNames = classnames.bind(styles)

const Header = () => {
  return (
    <header className={classNames("header")}>
      <div className={classNames("header-logo")}>
        <Image className={classNames("header-logo-img")} src={ImgRobotIcon} alt="流程助手" />
      </div>
      <span className={classNames("header-title")}>流程助手</span>
    </header>
  )
}

export default Header
