import { RFC } from '@/types/fixed-types';
import styles from './_style.module.scss';

// fix: 完全使用箭头函数
const App: RFC = () => {
    return <div className={styles.testerApp}>Hello World with EsBuild</div>;
};

export default App;
