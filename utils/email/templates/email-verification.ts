import { IUser } from '@/types/user.type';

const appName = process.env.NEXT_PUBLIC_APP_NAME;

const getEmailVerificationTemplate = (user: IUser, tokenLink: string) => `
<table class="es-content" cellspacing="0" cellpadding="0" align="center" bgcolor="#ffffff">
	<tbody>
		<tr>
			<td class="esd-stripe" align="center">
				<table  cellspacing="0" cellpadding="0">
					<tbody>
						<tr>
							<td class="esd-container-frame" width="560"  align="center">
								<table  cellspacing="0" cellpadding="0">
									<tbody>
										<tr>
											<td class="esd-block-text es-m-txt-c es-p10b" align="left">
												<h1 style="font-size: 20px;color:#28357C;text-align:center">Validez votre adresse email</h1>
												<p>Bonjour ${ user.username && user.username !== '' ? user.username : user.email }</p>
												<p>Pour activer votre compte, nous vous invitons à cliquer sur le lien ci-dessous:</p>
												<p><a style="word-break: break-all;" href="${ tokenLink }">${ tokenLink }</a></p>
											</td>
										</tr>
										<tr style="border-collapse:collapse">
											<td align="center" class="es-m-txt-c" style="padding-top:40px;padding-bottom:40px">
												<span class="msohide es-button-border" style="border-style:solid;border-color:#1B2A2F;background-color:#28357C;border-width:0px;display:inline-block;border-radius:100px;width:auto;mso-hide:all"><a href="${ tokenLink }" class="es-button msohide" target="_blank" style="mso-style-priority:100 !important;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;color:#FFFFFF;font-size:18px;border-style:solid;border-color:#28357C;border-width:25px 40px 25px 40px;display:inline-block;background-color:#28357C;border-radius:100px;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-weight:600;font-style:normal;line-height:22px;width:auto;text-align:center;mso-hide:all;border-left-width:40px;border-right-width:40px">Confirmer mon compte</a></span>
											</td>
										</tr>
										<tr>
											<td align="left" class="esd-block-text es-p40b">
												<p style="font-family: arial, 'helvetica neue', helvetica, sans-serif;">Bien cordialement,</p>
												<p style="font-family: arial, 'helvetica neue', helvetica, sans-serif;">${ appName }</p>
											</td>
										</tr>
									</tbody>
								</table>
							</td>
						</tr>
					</tbody>
				</table>
			</td>
		</tr>
	</tbody>
</table>
`;

export default getEmailVerificationTemplate;