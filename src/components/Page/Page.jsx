import { createEffect, createMemo } from 'solid-js';
import { backButton } from '@telegram-apps/sdk-solid';

import { useNavigate } from '@solidjs/router';

import './Page.css';

export function Page(props) {
  const navigate = useNavigate();
  const back = createMemo(() => typeof props.back === 'boolean' ? props.back : true);

  createEffect(() => {
    if (back()) {
      backButton.show();
      return backButton.onClick(() => {
        navigate(-1);
      });
    }
    backButton.hide();
  });

  return (
    <div class="page">
      <h1>{props.title}</h1>
      {props.disclaimer && <div class="page__disclaimer">{props.disclaimer}</div>}
      {props.children}
    </div>
  );
}
