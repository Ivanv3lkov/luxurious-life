import { Link, useParams } from 'react-router-dom';
import { MdHomeWork } from 'react-icons/md';
import { IoCarSportSharp } from 'react-icons/io5';

import './Items.css';

const Items: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();

  return (
    <div className="item__links center">
      <div className="item__link">
        <Link to={`/${userId}/homes`}>
          <MdHomeWork color="#0e2f44" size="20rem"/>
        </Link>
      </div>
      <div className="item__link">
        <Link to={`/${userId}/cars`}>
          <IoCarSportSharp color="#0e2f44" size="20rem"/>
        </Link>
      </div>
    </div>
  );
};

export default Items;
