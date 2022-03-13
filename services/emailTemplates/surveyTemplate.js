const keys = require('../../config/keys');

const surveyTemplate = survey => email => {
  return `
    <html>
      <body>
        <div style="text-align: center;">
          <h3>I'd like your input!</h3>
          <p>Please answer the following question:</p>
          <p>${survey.body}</p>
          <div>
            <a href="${keys.redirectDomain}/api/surveys/${survey.id}/yes?email=${email}">Yes</a>
          </div>
          <div>
            <a href="${keys.redirectDomain}/api/surveys/${survey.id}/no?email=${email}">No</a>
          </div>
        </div>
      </body>
    </html>
  `;
};

module.exports = surveyTemplate;
