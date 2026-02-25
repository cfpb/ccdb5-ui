import './Hero.scss';
import { useDispatch } from 'react-redux';
import { Button, Heading, Link } from '@cfpb/design-system-react';
import { LINK_DATA_USE, MODAL_TYPE_MORE_ABOUT } from '../../../constants';
import { modalShown } from '../../../reducers/view/viewSlice';

export const Hero = () => {
  const dispatch = useDispatch();

  return (
    <header className="content__hero">
      <Heading type="1" className="content-header">
        Consumer Complaint Database
      </Heading>
      <ul className="m-list m-list--horizontal">
        <li className="m-list__item">
          <Button
            label="Things to know before you use this database"
            isLink
            onClick={() => {
              dispatch(modalShown(MODAL_TYPE_MORE_ABOUT));
            }}
          />
        </li>
        <li className="m-list__item">
          <Link
            href={LINK_DATA_USE}
            label="How we use complaint data"
            target="_blank"
            rel="noopener noreferrer"
          />
        </li>
        <li className="m-list__item">
          <Link
            href="https://cfpb.github.io/api/ccdb/"
            iconRight="external-link"
            target="_blank"
            rel="noopener noreferrer"
            label="Technical documentation"
          />
        </li>
      </ul>
    </header>
  );
};
