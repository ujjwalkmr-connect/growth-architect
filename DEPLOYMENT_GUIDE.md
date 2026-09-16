# Simple deployment guide — Ujjwal's existing website

Follow these steps in order. You will update **the existing repository and existing Vercel project**, keeping **https://ujjwalkmr.vercel.app**.

**Your computer → GitHub stores the code → Vercel builds it → your website updates.** Google handles the private enquiry Sheet, emails and resume separately.

The code is ready locally. The account setup below has not been completed for you. Publishing code alone will show the pages, but the form and CMS need the setup in steps 4–7.

**What you will do:** steps 1–3 upload the code; steps 4–7 connect the services once; step 8 publishes; step 9 tests the result. After this first setup, use step 10 for everyday updates.

**Hosting cost:** Vercel Hobby allows personal, non-commercial use. If you use this site to promote or collect enquiries for **paid consulting services**, do not assume Hobby is permitted. The Consulting Services option is included as requested; no paid plan has been purchased. [Vercel's Hobby policy](https://vercel.com/docs/plans/hobby)

## 1. Sign in to the correct accounts

1. Open [your GitHub repository](https://github.com/ujjwalkmr-connect/growth-architect). Sign in as **ujjwalkmr-connect**, or an account with permission to push changes to it.
2. Open [Vercel](https://vercel.com/dashboard). Choose the account/team containing your existing website.
3. Open that Vercel project and check **Settings → Domains**. You should see **ujjwalkmr.vercel.app**.

**Checkpoint:** you can access the repository and the Vercel project that owns this exact address. If your Vercel dashboard is empty, switch accounts/teams before continuing. Creating a different project will not automatically inherit your current address.

## 2. Put the updated files into a local GitHub copy

Use [GitHub Desktop](https://desktop.github.com/), which lets you upload the code without learning Git commands. Install it if necessary and sign in with the account from step 1. [GitHub's cloning instructions](https://docs.github.com/en/desktop/adding-and-cloning-repositories/cloning-and-forking-repositories-from-github-desktop)

1. In GitHub Desktop choose **File → Clone repository → URL**.
2. Enter `https://github.com/ujjwalkmr-connect/growth-architect`.
3. Set **Local path** to a new folder, for example:

   `C:\Users\Ankuram IVF\Downloads\growth-architect-deploy`

   Use this Downloads location on this computer. Windows Controlled Folder Access blocks Node.js and Git writes under Documents, which can leave `npm ci` spinning without progress. Keep Windows protection enabled; work from Downloads instead.

4. Click **Clone**. Then choose **Current branch → New branch**, name it `portfolio-additions`, and create it. This keeps the current live version on `main` until you are ready.
5. Open the updated source folder in File Explorer:

   `C:\Users\Ankuram IVF\Documents\Codex\2026-09-16\an\outputs\growth-architect-preserved`

6. Turn on **View → Show → Hidden items**. Copy **everything inside this source folder** into the cloned folder from step 3. Choose **Replace the files in the destination** when Windows asks.
7. Open the cloned folder. You should see `package.json`, `vercel.json`, `src`, `api`, `content`, `public` and `google-apps-script` directly inside it. They must not be inside an extra `growth-architect-preserved` subfolder.

If you previously copied an earlier version of these changes into the clone, remove `src/routes/resume.tsx` if it exists. This old standalone page has been replaced by the resume popup. Keep `api/resume.ts`, which securely serves the PDF.

Use only the `growth-architect-preserved` source folder. The older `ujjwal-portfolio` folder is the discarded redesign.

The source includes an encoded copy of your original portrait; the build restores the image automatically. The resume is deliberately absent because the GitHub repository is public.

**Checkpoint:** GitHub Desktop's **Changes** tab shows the updated files. The original `.git` folder in the clone is still there.

## 3. Check the code, then upload your branch

Node.js 24 is already available on this computer. On another computer, install the current LTS version from [Node.js](https://nodejs.org/) first.

Open PowerShell. Run each command below separately, waiting for it to finish. If you chose a different clone folder, change only the first line.

```powershell
Set-Location -LiteralPath 'C:\Users\Ankuram IVF\Downloads\growth-architect-deploy'
npm ci
npm test
npm run typecheck
npm run build
```

The tests should pass, type checking should finish without errors, and the build should report success. To view the website locally, run `npm run dev` and open **http://127.0.0.1:5173**. If that port is already in use, the Codex preview may already be running; the successful build is sufficient for this step.

Return to GitHub Desktop:

1. Check that no `.env.local`, private resume PDF or secret has appeared in the Changes list. The supplied ignore rules exclude local secrets and private files.
2. Enter a summary such as **Add portfolio pages, CMS and contact form**.
3. Click **Commit to portfolio-additions**.
4. Click **Publish branch**, or **Push origin** if the branch already exists.

**Checkpoint:** GitHub shows a `portfolio-additions` branch with your updated code. Leave it unmerged until step 8. Vercel can build a preview branch, but CMS login and form submission are configured for the production address, not arbitrary preview URLs. [How Vercel uses GitHub branches](https://vercel.com/docs/git/vercel-for-github)

## 4. Connect Google Sheets, Gmail sending and the private resume

Use the Google account from which you want notification emails sent. It can send owner alerts to your existing Outlook address. You do **not** need a Gmail app password.

### Create the Sheet and store the resume

1. Open [Google Sheets](https://sheets.google.com/) and create a blank spreadsheet named **Ujjwal Portfolio Enquiries**. Keep sharing **Restricted**.
2. Copy its ID from the address: in `https://docs.google.com/spreadsheets/d/ABC123/edit`, the ID is `ABC123`.
3. Upload your supplied resume PDF to [Google Drive](https://drive.google.com/), using the same Google account. Keep general access **Restricted**. The supplied PDF is below this app's 1 MB limit.
4. Open the PDF in Drive and copy its file ID: in `https://drive.google.com/file/d/XYZ123/view`, the ID is `XYZ123`.

### Generate three private keys

Run this once in PowerShell. It prints three different random values. Store them privately; you will paste the values into Google/Vercel settings, **not into code or chat**.

```powershell
node -e "for (const key of ['GOOGLE_BRIDGE_SECRET','RESUME_SIGNING_SECRET','CMS_COOKIE_SECRET']) console.log(key+'='+require('node:crypto').randomBytes(32).toString('hex'))"
```

Copy only the value after `=` when filling a setting.

### Create the Google script

1. Open [Google Apps Script](https://script.google.com/) → **New project**. Name it **Ujjwal Portfolio Forms**.
2. Open `google-apps-script\Code.gs` from your cloned source folder in a text editor. Copy its entire contents and replace the starter code in Apps Script's `Code.gs`. Save.
3. In Apps Script, open **Project Settings** and enable **Show appsscript.json manifest file in editor**.
4. Return to the editor. Replace `appsscript.json` with the contents of the supplied `google-apps-script\appsscript.json`. Save.
5. In **Project Settings → Script Properties**, add these five entries:

| Property name — copy exactly | Value |
|---|---|
| `SHEET_ID` | Spreadsheet ID copied above |
| `OWNER_EMAIL` | The inbox where you want enquiries, e.g. `ujjwalkmr@outlook.com` |
| `BRIDGE_SECRET` | The generated **GOOGLE_BRIDGE_SECRET** value |
| `RESUME_FILE_ID` | Private PDF's Drive file ID |
| `RESUME_VERSION` | `2026-09` |

6. Return to the editor, select **setup** from the function dropdown and click **Run**. Authorize your own script in the intended Google account when prompted.
7. Open the Sheet. It should now have **Leads** and **Replay** tabs. A five-minute notification trigger is also created; no email is sent just by running setup.
8. In Apps Script choose **Deploy → New deployment → Select type → Web app**. Set **Execute as: Me** and **Who has access: Anyone**, then click **Deploy**.
9. Copy the **Web app URL**, ending in `/exec`. Save it as your `GOOGLE_SCRIPT_URL` for step 7. Do not copy the editor URL or `/dev` test URL.

The public web-app endpoint authenticates requests using your private bridge key; the Sheet and PDF remain Restricted. If your Google Workspace account does not offer “Anyone,” its administrator may restrict this deployment. [Google's web-app deployment guide](https://developers.google.com/apps-script/guides/web)

**Already set up an earlier version?** Replace `Code.gs` and the manifest, run `setup`, then use **Deploy → Manage deployments → Edit → Version: New version → Deploy**. This updates the existing `/exec` endpoint. Do this before publishing the website changes. Phone uses the new **column V**, so the original Sheet columns stay in place; V must be empty or already labelled `phone`.

**Checkpoint:** you have a private Sheet, a private PDF, an authorized script and its `/exec` URL.

## 5. Create the form's spam-protection widget

1. Sign in to [Cloudflare](https://dash.cloudflare.com/) and open **Turnstile**.
2. Add a widget named **Ujjwal Portfolio**.
3. Add the hostname **ujjwalkmr.vercel.app**, without `https://` or a path.
4. Choose **Managed** mode and create it.
5. Save the **Site key** and **Secret key** for step 7. These are different values.

You do not need to move your domain or change DNS to use Turnstile. [Cloudflare widget setup](https://developers.cloudflare.com/turnstile/get-started/widget-management/dashboard/)

## 6. Create the CMS login application in GitHub

This allows the `/admin/` editor to save your changes into your repository.

1. While signed in to GitHub, open **Settings → Developer settings → OAuth Apps → New OAuth App**.
2. Enter these values:

| Field | Value |
|---|---|
| Application name | `Ujjwal Portfolio CMS` |
| Homepage URL | `https://ujjwalkmr.vercel.app` |
| Authorization callback URL | `https://ujjwalkmr.vercel.app/api/cms-callback` |

3. Register the application. Copy its **Client ID**.
4. Choose **Generate a new client secret** and save that value privately.

The person signing in to the CMS must have write permission to `ujjwalkmr-connect/growth-architect`. Read-only access is insufficient. [GitHub OAuth app instructions](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app)

## 7. Configure the existing Vercel project

Open the project you identified in step 1.

Under **Settings → Git**, confirm the connected repository is **ujjwalkmr-connect/growth-architect**. Use **main** as the production branch. Under the project's **Build and Deployment** settings use:

| Setting | Value |
|---|---|
| Framework preset | `Vite` |
| Root directory | Repository root — leave blank/default, not `src` or `dist` |
| Install command | `npm ci` |
| Build command | `npm run build` |
| Output directory | `dist` |
| Node.js version | `24.x` |

The included `vercel.json` handles page routing and the API functions. There is no separate backend server to buy or start.

Open **Settings → Environment Variables**. For every row below, add the name exactly as written, paste its value, select **Production**, and save. Do not add quotation marks around values.

| Variable name | Value to enter |
|---|---|
| `SITE_URL` | `https://ujjwalkmr.vercel.app` — no trailing slash |
| `VITE_TURNSTILE_SITE_KEY` | Cloudflare **Site key** from step 5 |
| `TURNSTILE_SECRET_KEY` | Cloudflare **Secret key** from step 5 |
| `GOOGLE_SCRIPT_URL` | Apps Script web-app URL ending in `/exec` |
| `GOOGLE_BRIDGE_SECRET` | Same value as Google's `BRIDGE_SECRET` |
| `RESUME_SIGNING_SECRET` | Generated value with this name from step 4 |
| `CMS_REPO` | `ujjwalkmr-connect/growth-architect` |
| `GITHUB_OAUTH_CLIENT_ID` | GitHub OAuth application's Client ID |
| `GITHUB_OAUTH_CLIENT_SECRET` | GitHub OAuth application's client secret |
| `CMS_COOKIE_SECRET` | Generated value with this name from step 4 |

Only the Turnstile site key has a `VITE_` prefix. Keep the private keys under their exact server-only names. New or changed environment variables take effect on the **next deployment**. [Vercel environment-variable instructions](https://vercel.com/docs/environment-variables/managing-environment-variables)

**Checkpoint:** the correct repository is linked, the build settings match the table, and all ten Production variables are saved.

## 8. Publish to your existing address

1. Open your repository on GitHub. Select **Compare & pull request** for `portfolio-additions`, or create a pull request with **base: main** and **compare: portfolio-additions**.
2. Review the changed files and preview pages. Create the pull request, then choose **Merge pull request → Confirm merge** when ready to update the live website.
3. In Vercel, open **Deployments** and watch the new **Production** deployment for `main`.
4. Wait until its status is **Ready**. Open **https://ujjwalkmr.vercel.app** and refresh.

If the code was already merged before adding the environment variables, open the latest production deployment's menu and choose **Redeploy**. Confirm the deployment uses the updated variables.

**Checkpoint:** the existing website now has the new pages, and Contact shows its form directly, with required Phone number and Consulting Services. You do not need to use adzapp.in or change Hostinger settings.

## 9. Confirm the form, resume and CMS actually work

Use your own email address for one test. Do not use a real recruiter's details for testing.

1. On the homepage, click **Get In Touch**. Contact should show your email, phone, LinkedIn and the form immediately. Select **Consulting Services**, enter your name, email, required phone number and message, agree to the notice and submit after the security check is complete.
2. The form should show success while staying on Contact. In the Sheet's **Leads** tab, confirm one new row, `consulting` in the purpose column and your number in **phone / column V**.
3. Allow about five minutes for the notification queue. Check the owner inbox and test visitor inbox, including Spam. The owner alert should include the phone number. Each notification's status should become `sent` in the Sheet; actual delivery can take longer or be deferred by Google quotas.
4. On the homepage, click **Download Resume**. A popup should open without changing the page. Complete the required name, email, phone and consent fields, then submit and click **Download PDF**. There is no separate Download Resume page. In a private/incognito window without submitting the form, `/api/resume` should refuse the download.
5. Open **https://ujjwalkmr.vercel.app/admin/**. Log in to GitHub, edit a draft or an intended content field, and save. Confirm a GitHub commit and a new Vercel deployment. After it is Ready, check the public result.

## 10. Make future updates

- **Projects, images, experience and blogs:** open `/admin/`, edit and save. Projects and posts require `published` status to show publicly; Featured controls homepage projects. Saving commits to GitHub, then Vercel rebuilds automatically. A future-dated article needs a new build on or after its date.
- **Acknowledgement email wording:** use **Email settings** in the CMS.
- **Website code:** edit your local clone, commit in GitHub Desktop and push. For review first, use a branch and merge when ready.
- **Google script changes:** update Apps Script and deploy a **New version** there as well. A GitHub push does not update Google's script.
- **Resume replacement:** replace the private Drive PDF, update `RESUME_FILE_ID` if it changes, and change `RESUME_VERSION` plus `content/settings/resume.json` to the same new version. Redeploy Google and Vercel.

## If something does not work

| What you see | What to check |
|---|---|
| GitHub asks to fork, or says permission denied | Sign in as the repository owner or obtain write access. A fork is not your current deployment repository. |
| No website project in Vercel | Switch to the account/team owning `ujjwalkmr.vercel.app`. |
| Red/failed Vercel deployment | Open its Build Logs. Check the first actual error, Node version, root directory and build settings. |
| `npm ci` keeps spinning in a Documents folder | On this computer, Windows Controlled Folder Access blocks that location. Use the repository copy at `C:\Users\Ankuram IVF\Downloads\growth-architect-deploy`. In GitHub Desktop, choose **File → Add local repository** and select that folder. |
| Pages work, but Send message is disabled | Check the Production Turnstile site key, allowed hostname and redeploy. |
| “Form is not configured” | Check all form-related Production variables and redeploy. |
| Submission fails after verification | Confirm the latest Google script version, `/exec` URL, matching bridge key and script permissions. Check Apps Script **Executions**. |
| Submission saved, but no email | Check Spam, the five-minute trigger, Google quota and `ownerState` / `ackState` in Leads. Do not blindly resend a row marked `needs_review`; delivery may already have occurred. |
| CMS login fails | Check the exact callback URL, CMS variables, production address and repository write access. |
| Resume unavailable | Check Restricted sharing, PDF size, file ID, read-only Drive authorization and matching `2026-09` versions. |

If a deployment causes an issue, open the last working Production deployment in Vercel and use **Rollback** if available. Also revert the problematic GitHub change before publishing again, because future builds use the repository contents.
