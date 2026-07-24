import { selectViewIsPrintMode } from '../../reducers/view/selectors';
import { useSelector } from 'react-redux';

export const PrintInfoFooter = () => {
  const isPrintMode = useSelector(selectViewIsPrintMode);
  return isPrintMode ? (
    <section className="print-info-footer">
      <p>
        <span>URL:</span> {globalThis.location.href}
      </p>
    </section>
  ) : null;
};
