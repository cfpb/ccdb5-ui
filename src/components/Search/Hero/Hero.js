import './Hero.less';
import { useDispatch } from 'react-redux';
import React from 'react';
import { LINK_DATA_USE, MODAL_TYPE_MORE_ABOUT } from '../../../constants';
import { modalShown } from '../../../reducers/view/viewSlice';

export const Hero = () => {
  const dispatch = useDispatch();

  return (
    <header className="content_hero">
      <h1 className="content-header">Consumer Complaint Database</h1>
      <ul className="m-list m-list__horizontal">
        <li className="m-list_item">
          <button
            className="a-btn a-btn__link"
            onClick={() => {
              dispatch(modalShown(MODAL_TYPE_MORE_ABOUT));
            }}
          >
            Things to know before you use this database
          </button>
        </li>
        <li className="m-list_item">
          <a href={LINK_DATA_USE} target="_blank" rel="noopener noreferrer">
            How we use complaint data
          </a>
        </li>
        <li className="m-list_item">
          <a
            href="https://cfpb.github.io/api/ccdb/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Technical documentation
          </a>
        </li>
      </ul>
    </header>
  );
};
