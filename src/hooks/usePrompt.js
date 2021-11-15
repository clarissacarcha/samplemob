import React from 'react';
import {PromptProviderContext} from 'src/provider/PromptProvider';

export const usePrompt = () => {
  const prompt = React.useContext(PromptProviderContext);

  return prompt;
};
