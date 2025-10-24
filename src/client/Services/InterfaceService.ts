import Logger from "@shared/Logger";

export default class InterfaceService {
    private static browser: BrowserMp = null!;
    private static logger: Logger = Logger.getLogger(InterfaceService);

    public static init() {
        this.browser = mp.browsers.new('package://ui/index.html');
        if (!this.browser) {
            this.logger.error('Failed to initialize interface: Browser instance is null');
            return;
        }
        
        this.logger.info('Interface initialized successfully');
    }
}