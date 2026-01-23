import React from 'react';
import { Alert } from 'antd';
import { createStyles } from 'antd-style';

const useStyle = createStyles(({ token, css }) => ({
  title: css({
    display: 'inline-block',
    fontSize: token.fontSizeLG * 2,
    background: `linear-gradient(to right, ${token.colorError}, ${token.colorWarning})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  })
}))

const Title = (props: React.HTMLAttributes<HTMLDivElement>) => (
  <div {...props}>
    ANTD-STYLE
  </div>
)

const App: React.FC = () => {
  const { styles } = useStyle();

  return (
    <Alert
      message={<Title className={styles.title} />}
      type="info"
      description="css-in-js library with antd v5 token system"
    />
  )
}

export default App;