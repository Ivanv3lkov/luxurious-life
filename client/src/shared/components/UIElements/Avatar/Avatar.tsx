import './Avatar.css';

type Props = {
  image: string;
  alt: string;
  className?: string;
  style?: object;
  width?: number;
};

const Avatar: React.FC<Props> = ({ image, alt, className, style, width }) => {
  return (
    <div className={`avatar ${className}`} style={style}>
      {' '}
      <img src={image} alt={alt} style={{ width: width, height: width }} />
    </div>
  );
};

export default Avatar;
