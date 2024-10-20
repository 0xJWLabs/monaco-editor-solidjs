import { A, Route, Router } from '@solidjs/router';
import type { Component, ParentComponent } from 'solid-js';
import styles from './app.module.css';
import { MonacoPlayground } from './monaco';

const Wrapper: ParentComponent = props => {
  return (
    <div class={styles.root}>
      <div class={styles.header}>
        solid-monaco playground
        <div class={styles.nav}>
          <A href="/" class={styles.navItem} activeClass={styles.navItemActive} end>
            Editor
          </A>
        </div>
      </div>
      <div class={styles.editorContainer}>{props.children}</div>
    </div>
  )
}

const App: Component = () => {
  return (
    <Router root={Wrapper}>
      <Route path="/" component={MonacoPlayground} />
    </Router>
  )
}

export default App
