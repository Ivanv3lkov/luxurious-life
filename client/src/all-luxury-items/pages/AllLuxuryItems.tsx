import { Link } from 'react-router-dom';
import { MdHomeWork } from 'react-icons/md';
import { IoCarSportSharp } from 'react-icons/io5';

import './AllLuxuryItems.css';

const AllLuxuryItems: React.FC = () => {
  return (
    <div className="item__links">
      <div className="item__link">
        <Link to={`/homes`}>
          <MdHomeWork color="#0e2f44" size="20rem"/>
        </Link>
      </div>
      <div className="item__link">
        <Link to={`/cars`}>
          <IoCarSportSharp color="#0e2f44" size="20rem"/>
        </Link>
      </div>
    </div>
  );
};

export default AllLuxuryItems;
