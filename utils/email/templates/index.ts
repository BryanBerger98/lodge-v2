const appName = process.env.NEXT_PUBLIC_APP_NAME;

export const defaultHead = `
        <head>
            <meta charset="UTF-8">
            <meta content="width=device-width, initial-scale=1" name="viewport">
            <meta name="x-apple-disable-message-reformatting">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta content="telephone=no" name="format-detection">
            <title></title>
            <!--[if (mso 16)]>
                <style type="text/css">
                    a {text-decoration: none;}
                </style>
            <![endif]-->
            <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]-->
        </head>
     `;

export const defaultHeader = `<h1>${ appName }</h1>`;

export const getMainTemplateBody = (htmlBody: string) => `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
	${ defaultHead }
	<body style="font-family: sans-serif;">
		<div class="es-wrapper-color">
			<!--[if gte mso 9]>
				<v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
					<v:fill type="tile" color="#f6f6f6"></v:fill>
				</v:background>
			<![endif]-->
			<table class="es-wrapper"  cellspacing="0" cellpadding="0">
				<tbody>
					<tr>
						<td class="esd-email-paddings" >
							${ defaultHeader }
							<br>
							<br>
							<br>
							<br>
							${ htmlBody }
							<br>
							<br>
							<br>
							<br>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</body>
</html>
`;