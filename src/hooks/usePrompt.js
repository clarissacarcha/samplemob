import React from 'react';
import {PromptProviderContext} from '../provider/PromptProvider';

export const usePrompt = () => {
  const prompt = React.useContext(PromptProviderContext);

  return prompt;
};
