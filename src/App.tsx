import { RFC } from '@/types/fixed-types';
import styles from './_style.module.scss';

// fix: Using arron-functional component only.
const App: RFC = () => {
    return <div className={styles.testerApp}>Hello World with EsBuild</div>;
};

export default App;
